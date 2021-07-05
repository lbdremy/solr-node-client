/**
 * Load dependencies
 */
const Query = require('./query'),
  Collection = require('./collection'),
  querystring = require('querystring'),
  format = require('./utils/format'),
  JSONStream = require('JSONStream'),
  duplexer = require('duplexer'),
  request = require('request'),
  versionUtils = require('./utils/version'),
  Promise = require('bluebird');

// eslint-disable-next-line
const http = require('http');

const {
  handleJSONResponse,
  pickJSON,
  pickProtocol,
} = require('./client');

/**
 * Expose `createClient()`.
 */
exports.createClient = createClient;

/**
 * Create an instance of `Client`
 *
 * @param {{}} options
 *   See the `Client` constructor.
 *
 * @return {Client}
 * @api public
 */
function createClient(options = {}) {
  return new Client(options);
}

/**
 * Solr client
 * @constructor
 *
 * @param {{}} options
 *   Solr client configuration options.
 * @param {String} options.host
 *   IP address or host name of the Solr server
 * @param {Number | String} options.port
 *   Port number of the Solr server.
 *   0 to be ignored by HTTP agent in case of using API endpoint.
 * @param {String} options.core
 *   Name of the Solr core.
 * @param {String} options.path
 *   Root path of all requests.
 * @param {Boolean} options.secure
 *   True to use HTTPS instead of HTTP.
 * @param {Boolean} options.bigint
 *   True to use JSONbig serializer & deserializer instead of native JSON
 *   serializer & deserializer.
 * @param {Number} options.ipVersion
 *   IP version 4 or 6. Passed to http/https lib's "family" option.
 * @param {Object} options.request
 *   Extra options to send with each request.
 * @param {http.Agent | undefined} options.agent
 *   Optional HTTP Agent which is used for pooling sockets used in HTTP(s)
 *   client requests.
 *
 * @return {Client}
 * @api private
 */
function Client(options) {
  this.options = {
    // Defaults.
    host: '127.0.0.1',
    port: 8983,
    core: '',
    path: '/solr',
    secure: false,
    bigint: false,
    get_max_request_entity_size: false,
    solrVersion: versionUtils.Solr3_2,
    ipVersion: 4,

    // Overrides.
    ...options,
  };

  // Default paths of all request handlers
  this.UPDATE_JSON_HANDLER =
    versionUtils.version(this.options.solrVersion) >= versionUtils.Solr4_0
      ? 'update'
      : 'update/json';
  this.UPDATE_HANDLER = 'update';
  this.SELECT_HANDLER = 'select';
  this.COLLECTIONS_HANDLER = 'admin/collections';
  this.ADMIN_PING_HANDLER = 'admin/ping';
  this.REAL_TIME_GET_HANDLER = 'get';
  this.SPELL_HANDLER = 'spell';
  this.TERMS_HANDLER = 'terms';
}

/**
 * Create credential using the basic access authentication method
 *
 * @param {String} username
 * @param {String} password
 *
 * @return {Client}
 * @api public
 */
Client.prototype.basicAuth = function (username, password) {
  const self = this;
  this.options.authorization =
    'Basic ' + new Buffer(username + ':' + password).toString('base64');
  return self;
};

/**
 * Remove authorization header
 *
 * @return {Client}
 * @api public
 */
Client.prototype.unauth = function () {
  const self = this;
  delete this.options.authorization;
  return self;
};

/**
 * Add a document or a list of documents
 *
 * @param {{}[]} docs
 *   List of documents to add to the Solr database.
 * @param {{}} queryOptions
 *   Extra key-value pairs to include in the URL query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.add = function (docs, queryOptions, callback) {
  docs = format.dateISOify(docs);
  return this.update(docs, queryOptions, callback);
};

/**
 * Alias of `add`.
 *
 * This was added to give more clarity on the availability of atomic updates.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.atomicUpdate = Client.prototype.add;

/**
 * Get a document by id or a list of documents by ids using the Real-time-get
 * feature in SOLR4 (https://wiki.apache.org/solr/RealTimeGet).
 *
 * @param {String[]} ids
 *   List of ids that identify the documents to get.
 * @param {Query|Object|String} query
 *   Extra key-value pairs to include in the URL query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.realTimeGet = function (ids, query, callback) {
  query.ids = ids.join(',');
  return this.doQuery(this.REAL_TIME_GET_HANDLER, query, callback);
};

/**
 * Add the remote resource located at `options.path` into the Solr database.
 *
 * @param {Object} options -
 * @param {String} options.path - path of the file. HTTP URL, the full path or
 *   a path relative to the CWD of the running solr server must be used.
 * @param {String} [options.format='xml'] - format of the resource. XML, CSV or
 *   JSON formats must be used.
 * @param {String} [options.contentType='text/plain;charset=utf-8'] - content
 *   type of the resource
 * @param {Object} [options.parameters] - set of extras parameters pass along
 *   in the query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.addRemoteResource = function (options, callback) {
  options.parameters = options.parameters || {};
  options.format = options.format === 'xml' ? '' : options.format || ''; // reason: the default route of the XmlUpdateRequestHandle is /update and not /update/xml.
  options.parameters.commit =
    options.parameters.commit === undefined ? false : options.parameters.commit;
  options.parameters['stream.contentType'] =
    options.contentType || 'text/plain;charset=utf-8';
  if (options.path.match(/^https?:\/\//)) {
    options.parameters['stream.url'] = options.path;
  } else {
    options.parameters['stream.file'] = options.path;
  }

  const handler = this.UPDATE_HANDLER + '/' + options.format.toLowerCase();
  const query = querystring.stringify(options.parameters);
  return this.doQuery(handler, query, callback);
};

/**
 * Create a writable/readable `Stream` to add documents into the Solr database
 *
 * @param {Object} [options] -
 *
 * return {Stream}
 * @api public
 */
Client.prototype.createAddStream = function (options) {
  const path = [
    this.options.path,
    this.options.core,
    this.UPDATE_JSON_HANDLER +
      '?' +
      querystring.stringify({
        ...options,
        wt: 'json',
      }),
  ]
    .filter(function (element) {
      return element;
    })
    .join('/');
  const headers = {
    'content-type': 'application/json',
    charset: 'utf-8',
  };
  if (this.options.authorization) {
    headers['authorization'] = this.options.authorization;
  }
  const protocol = this.options.secure ? 'https' : 'http';
  const optionsRequest = {
    url: protocol + '://' + this.options.host + ':' + this.options.port + path,
    method: 'POST',
    headers: headers,
  };
  const jsonStreamStringify = JSONStream.stringify();
  const postRequest = request(optionsRequest);
  jsonStreamStringify.pipe(postRequest);
  return duplexer(jsonStreamStringify, postRequest);
};

/**
 * Commit last added and removed documents, that means your documents are now
 * indexed.
 *
 * @param {{}} queryOptions
 *   Extra key-value pairs to include in the URL query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.commit = function (queryOptions, callback) {
  const data = {
    commit: queryOptions || {},
  };
  return this.update(data, {}, callback);
};

/**
 * Call Lucene's IndexWriter.prepareCommit, the changes won't be visible in the
 * index.
 *
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.prepareCommit = function (callback) {
  return this.update({}, { prepareCommit: true }, callback);
};

/**
 * Soft commit all changes
 *
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.softCommit = function (callback) {
  return this.update({}, { softCommit: true }, callback);
};

/**
 * Delete documents based on the given `field` and `text`.
 *
 * @param {String} field
 * @param {String} text
 * @param {{}} queryOptions
 *   Extra key-value pairs to include in the URL query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.delete = function (field, text, queryOptions, callback) {
  const data = {
    delete: {
      query: field + ':' + format.escapeSpecialChars(text),
    },
  };
  return this.update(data, queryOptions, callback);
};

/**
 * Delete a range of documents based on the given `field`, `start` and `stop`
 * arguments.
 *
 * @param {String} field
 * @param {String|Date} start
 * @param {String|Date} stop
 * @param {{}} options
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.deleteByRange = function (
  field,
  start,
  stop,
  options,
  callback
) {
  start = format.dateISOify(start);
  stop = format.dateISOify(stop);

  const query = field + ':[' + start + ' TO ' + stop + ']';
  return this.deleteByQuery(query, options, callback);
};

/**
 * Delete the document with the given `id`
 *
 * @param {String|Number} id - id of the document you want to delete
 * @param {{}} queryOptions
 *   Extra key-value pairs to include in the URL query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.deleteByID = function (id, queryOptions, callback) {
  const data = {
    delete: {
      id: id,
    },
  };
  return this.update(data, queryOptions, callback);
};

/**
 * Delete documents matching the given `query`.
 *
 * @param {String} query
 *   The Solr query string.
 * @param {{}} queryOptions
 *   Extra key-value pairs to include in the URL query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.deleteByQuery = function (query, queryOptions, callback) {
  const data = {
    delete: {
      query: query,
    },
  };
  return this.update(data, queryOptions, callback);
};

/**
 * Delete all documents
 *
 * @param {Object} [options] -
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.deleteAll = function (options, callback) {
  return this.deleteByQuery('*:*', options, callback);
};

/**
 * Optimize the index
 *
 * @param {Object} options -
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.optimize = function (options, callback) {
  const data = {
    optimize: options || {},
  };
  return this.update(data, {}, callback);
};

/**
 * Rollback all add/delete commands made since the last commit.
 *
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.rollback = function (callback) {
  const data = {
    rollback: {},
  };
  return this.update(data, {}, callback);
};

/**
 * Send an update command to the Solr server with the given `data` stringified
 * in the body.
 *
 * @param {{}} data
 *   Data sent to the Solr server
 * @param {{}} queryOptions
 *   Extra key-value pairs to include in the URL query.
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api private
 */
Client.prototype.update = function(data, queryOptions, callback) {
  const path = this.getFullHandlerPath(this.UPDATE_JSON_HANDLER);
  const queryString = querystring.stringify({
    ...queryOptions,
    wt: 'json',
  });

  return this.doRequest(
    `${path}?${queryString}`,
    'POST',
    pickJSON(this.options.bigint).stringify(data),
    'application/json',
    'application/json; charset=utf-8',
    callback,
  );
};

/**
 * Search documents matching the `query`
 *
 * @param {Query|Object|String} query
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.search = function (query, callback) {
  return this.doQuery(this.SELECT_HANDLER, query, callback);
};

/**
 * Execute an Admin Collections task on `collection`
 *
 * @param {Query|Object|String} collection
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.executeCollection = function (collection, callback) {
  return this.doQuery(this.COLLECTIONS_HANDLER, collection, callback);
};

/**
 * Search for all documents
 *
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.searchAll = function (callback) {
  return this.search('q=*', callback);
};

/**
 * Search documents matching the `query`
 *
 * Spellcheck is also enabled.
 *
 * @param {Query|Object|String} query
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.spell = function (query, callback) {
  return this.doQuery(this.SPELL_HANDLER, query, callback);
};

/**
 * Terms search
 *
 * Provides access to the indexed terms in a field and the number of documents
 * that match each term.
 *
 * @param {Query|Object|String} query
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.termsSearch = function (query, callback) {
  return this.doQuery(this.TERMS_HANDLER, query, callback);
};

/**
 * Perform a query. Auto-detect whether GET or POST should be used.
 *
 * @param {string} handler
 *   The solr "handler", i.e. request path.
 * @param {Query | Collection | object | string} query
 *   The query to perform.
 * @param {Function} callback
 *   The callback to run when the request completes.
 *
 * @returns {ClientRequest}
 *
 * @api private
 */
Client.prototype.doQuery = function(
  handler,
  query,
  callback,
) {
  // Construct the string to use as query (GET) or body (POST).
  let data;
  if (query instanceof Query || query instanceof Collection) {
    data = query.build();
  } else if (typeof query === 'object') {
    data = querystring.stringify(query);
  } else if (typeof query === 'string') {
    data = query;
  } else {
    throw new TypeError('Invalid type for the \'query\' parameter.');
  }

  const path = this.getFullHandlerPath(handler);
  const queryString = `${data}&wt=json`;

  // Decide whether to use GET or POST, based on the length of the data.
  // 10 accounts for protocol and special characters like ://, port colon,
  // initial slash, etc.
  const approxUrlLength =
    10 +
    Buffer.byteLength(this.options.host) +
    this.options.port.toString().length +
    Buffer.byteLength(path) +
    1 +
    Buffer.byteLength(queryString);
  const method = this.options.get_max_request_entity_size === false || approxUrlLength <= this.options.get_max_request_entity_size ? 'GET' : 'POST';

  return this.doRequest(
    method === 'GET' ? `${path}?${queryString}` : path,
    method,
    method === 'POST' ? data : null,
    method === 'POST' ? 'application/x-www-form-urlencoded; charset=utf-8' : null,
    'application/json; charset=utf-8',
    callback,
  );
};

/**
 * Common function for all requests.
 *
 * @param {string} path
 *   Full URL for the request.
 * @param {string} method
 *   HTTP method, like "GET" or "POST".
 * @param {string | null} body
 *   Optional data for the request body.
 * @param {string | null} bodyContentType
 *   Optional content type for the request body.
 * @param {string} acceptContentType
 *   The expected content type of the response.
 * @param {Function} callback
 *   The function to call when done.
 *
 * @returns {ClientRequest}
 *
 * @api private
 */
Client.prototype.doRequest = function(
  path,
  method,
  body,
  bodyContentType,
  acceptContentType,
  callback,
) {
  const requestOptions = {
    host: this.options.host,
    port: this.options.port,
    headers: this.options.headers || {},
    family: this.options.ipVersion,

    // Allow these to override (not merge with) previous values.
    ...this.options.request,

    method,
    path,
  };

  // Now set options that the user should not be able to override.
  requestOptions.headers.accept = acceptContentType;
  if (method === 'POST') {
    requestOptions.headers['content-type'] = bodyContentType;
    requestOptions.headers['content-length'] = Buffer.byteLength(body);
  }
  if (this.options.authorization) {
    requestOptions.headers.authorization = this.options.authorization;
  }
  if (this.options.agent) {
    requestOptions.agent = this.options.agent;
  }

  // Perform the request and handle results.
  const request = pickProtocol(this.options.secure).request(requestOptions);
  request.on('response', handleJSONResponse(
    request,
    this.options.bigint,
    callback,
    ),
  );
  request.on('error', function onError(err) {
    if (callback) {
      callback(err, null);
    }
  });
  if (body) {
    request.write(body);
  }
  request.end();
  return request;
};

/**
 * Construct the full path to the given "handler".
 *
 * @param {string} handler
 *   Relative URL path for the solr handler.
 *
 * @returns {string}
 *   Full URL to the handler.
 *
 * @api private
 */
Client.prototype.getFullHandlerPath = function(handler) {
  let pathArray;
  if (handler === this.COLLECTIONS_HANDLER) {
    pathArray = [this.options.path, handler];
  } else {
    pathArray = [
      this.options.path,
      this.options.core,
      handler,
    ];
  }
  return pathArray.filter(e => e).join('/');
};

/**
 * Create an instance of `Query`
 *
 * @return {Query}
 * @api public
 */
Client.prototype.query = function () {
  return new Query(this.options);
};

/**
 * Create an instance of `Query`
 * NOTE: This method will be deprecated in the v0.6 release. Please use
 * `Client.query()` instead.
 *
 * @return {Query}
 * @api public
 */
Client.prototype.createQuery = function () {
  return new Query(this.options);
};

/**
 * Create an instance of `Collection`
 *
 * @return {Collection}
 * @api public
 */
Client.prototype.collection = function () {
  return new Collection();
};

/**
 * Expose `format.escapeSpecialChars` from `Client.escapeSpecialChars`
 */
Client.prototype.escapeSpecialChars = format.escapeSpecialChars;

/**
 * Ping the Solr server
 *
 * @param {Function} callback(err,obj)
 *   A function executed when the Solr server responds or an error occurs.
 * @param {Error} callback().err
 * @param {Object} callback().obj
 *   Deserialized JSON response from the Solr server.
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.ping = function (callback) {
  return this.doQuery(this.ADMIN_PING_HANDLER, {}, callback);
};

/**
 * Utility only used in tests.
 *
 * @param {string} fieldName
 *   The name of the field to create.
 * @param {string} fieldType
 *   The type of field to create.
 * @param {Function} cb
 *   A callback to run when completed.
 *
 * @returns {ClientRequest}
 *
 * @api private
 */
Client.prototype.createSchemaField = function (fieldName, fieldType, cb) {
  return this.doRequest(
    this.getFullHandlerPath('schema'),
    'POST',
    pickJSON(this.options.bigint).stringify({
      'add-field': {
        name: fieldName,
        type: fieldType,
        multiValued: false,
        stored: true,
      },
    }),
    'application/json',
    'application/json; charset=utf-8',
    (err, data) => {
      if (err) {
        // TODO: We should handle this in a more robust way in the future, but
        //   there is a difference between default setup in Solr 5 and Solr 8,
        // so some fields already exist in Solr 8. Hence if that's the case, we
        // just ignore that.
        console.warn(err.message);
      }
      cb(undefined, data);
    },
  );
};

Promise.promisifyAll(Client.prototype);
