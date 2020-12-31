/*!
 * solr client
 * Copyright(c) 2011-2012 HipSnip Limited
 * Copyright(c) 2013-2014 Rémy Loubradou
 * Author Rémy Loubradou <remyloubradou@gmail.com>
 * MIT Licensed
 */

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
  postJSON,
} = require('./client');

/**
 * Expose `createClient()`.
 */

exports.createClient = createClient;

/**
 * Create an instance of `Client`
 *
 * @param {String|Object} [host='127.0.0.1'] - IP address or host address of the Solr server
 * @param {Number|String} [port='8983'] - port of the Solr server
 * @param {String} [core=''] - name of the Solr core requested
 * @param {String} [path='/solr'] - root path of all requests
 * @param {http.Agent} [agent] - HTTP Agent which is used for pooling sockets used in HTTP(s) client requests
 * @param {Boolean} [secure=false] - if true HTTPS will be used instead of HTTP
 * @param {Boolean} [bigint=false] - if true JSONbig serializer/deserializer will be used instead
 *                                    of JSON native serializer/deserializer
 * @param solrVersion ['3.2', '4.0', '5.0', '5.1'], check lib/utils/version.js for full reference
 * @param {Number} [ipVersion=4] - pass it to http/https lib's "family" option
 * @param {Object} request - request options
 *
 * @return {Client}
 * @api public
 */

function createClient(
  host,
  port,
  core,
  path,
  agent,
  secure,
  bigint,
  solrVersion,
  ipVersion,
  request
) {
  const options =
    typeof host === 'object'
      ? host
      : {
          host: host,
          port: port,
          core: core,
          path: path,
          agent: agent,
          secure: secure,
          bigint: bigint,
          solrVersion: solrVersion,
          ipVersion: ipVersion == 6 ? 6 : 4,
          request: request,
        };
  return new Client(options);
}

/**
 * Solr client
 * @constructor
 *
 * @param {Object} options - set of options used to request the Solr server
 * @param {String} options.host - IP address or host address of the Solr server
 * @param {Number|String} options.port - port of the Solr server, 0 to be ignored by HTTP agent in case of using API endpoint.
 * @param {String} options.core - name of the Solr core requested
 * @param {String} options.path - root path of all requests
 * @param {http.Agent} [options.agent] - HTTP Agent which is used for pooling sockets used in HTTP(s) client requests
 * @param {Boolean} [options.secure=false] - if true HTTPS will be used instead of HTTP
 * @param {Boolean} [options.bigint=false] - if true JSONbig serializer/deserializer will be used instead
 *                                    of JSON native serializer/deserializer
 * @param {Object} options.request - request options
 * @param {Number} [ipVersion=4] - pass it to http/https lib's "family" option
 *
 * @return {Client}
 * @api private
 */

function Client(options) {
  this.options = {
    host: options.host || '127.0.0.1',
    port: options.port === 0 ? 0 : options.port || '8983',
    core: options.core || '',
    path: options.path || '/solr',
    agent: options.agent,
    secure: options.secure || false,
    bigint: options.bigint || false,
    get_max_request_entity_size: options.get_max_request_entity_size || false,
    solrVersion: options.solrVersion || versionUtils.Solr3_2,
    ipVersion: options.ipVersion == 6 ? 6 : 4,
    request: options.request || null,
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
 * @param {Object|Array} doc - document or list of documents to add into the Solr database
 * @param {Object} [options] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.add = function (docs, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  docs = format.dateISOify(docs); // format `Date` object into string understable for Solr as a date.
  docs = Array.isArray(docs) ? docs : [docs];
  return this.update(docs, options, callback);
};

/**
 * Updates a document or a list of documents Solr 4.0+
 * This function is a clone of add and it was added to give more clarity on the availability of atomic updates.
 *
 * @param {Object|Array} doc - document or list of documents to be updated into the Solr database (set, inc, add)
 * @param {Object} [options] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.atomicUpdate = Client.prototype.add;

/**
 * Get a document by id or a list of documents by ids using the Real-time-get feature
 *  in SOLR4 (https://wiki.apache.org/solr/RealTimeGet)
 *
 * @param {String|Array} ids - id or list of ids that identify the documents to get
 * @param {Query|Object|String} [query] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.realTimeGet = function (ids, query, callback) {
  if (typeof query === 'function') {
    callback = query;
    query = {};
  }
  ids = Array.isArray(ids) ? ids : [ids];
  query.ids = ids.join(',');

  return this.get(this.REAL_TIME_GET_HANDLER, query, callback);
};

/**
 * Add the remote resource located at the given path `options.path` into the Solr database.
 *
 * @param {Object} options -
 * @param {String} options.path - path of the file. HTTP URL, the full path or a path relative to the CWD of the running solr server must be used.
 * @param {String} [options.format='xml'] - format of the resource. XML, CSV or JSON formats must be used.
 * @param {String} [options.contentType='text/plain;charset=utf-8'] - content type of the resource
 * @param {Object} [options.parameters] - set of extras parameters pass along in the query.
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
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
  return this.get(handler, query, callback);
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
      querystring.stringify(options) +
      '&wt=json',
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
  const duplex = duplexer(jsonStreamStringify, postRequest);
  return duplex;
};

/**
 * Commit last added and removed documents, that means your documents are now indexed.
 *
 * @param {Object} options
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.commit = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const data = {
    commit: options || {},
  };
  return this.update(data, callback);
};

/**
 * Call Lucene's IndexWriter.prepareCommit, the changes won't be visible in the index.
 *
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
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
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
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
 * @param {Object} [options]
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.delete = function (field, text, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  text = format.dateISOify(text);
  const data = {
    delete: {
      query: field + ':' + format.escapeSpecialChars(text),
    },
  };
  return this.update(data, options, callback);
};

/**
 * Delete a range of documents based on the given `field`, `start` and `stop` arguments.
 *
 * @param {String} field
 * @param {String|Date} start
 * @param {String|Date} stop
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
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
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  start = format.dateISOify(start);
  stop = format.dateISOify(stop);

  const query = field + ':[' + start + ' TO ' + stop + ']';
  return this.deleteByQuery(query, options, callback);
};

/**
 * Delete the document with the given `id`
 *
 * @param {String|Number} id - id of the document you want to delete
 * @param {Object} [options] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.deleteByID = function (id, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const data = {
    delete: {
      id: id,
    },
  };
  return this.update(data, options, callback);
};

/**
 * Delete documents matching the given `query`
 *
 * @param {String} query -
 * @param {Object} [options] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.deleteByQuery = function (query, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const data = {
    delete: {
      query: query,
    },
  };
  return this.update(data, options, callback);
};

/**
 * Delete all documents
 *
 * @param {Object} [options] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
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
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.optimize = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const data = {
    optimize: options || {},
  };
  return this.update(data, callback);
};

/**
 * Rollback all add/delete commands made since the last commit.
 *
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.rollback = function (callback) {
  const data = {
    rollback: {},
  };
  return this.update(data, callback);
};

/**
 * Send an update command to the Solr server with the given `data` stringified in the body.
 *
 * @param {Object} data - data sent to the Solr server
 * @param {Object} [options] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

Client.prototype.update = function (data, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  const json = pickJSON(this.options.bigint).stringify(data);
  const fullPath = [
    this.options.path,
    this.options.core,
    this.UPDATE_JSON_HANDLER +
      '?' +
      querystring.stringify(options) +
      '&wt=json',
  ]
    .filter(function (element) {
      return element;
    })
    .join('/');

  const params = {
    host: this.options.host,
    port: this.options.port,
    fullPath: fullPath,
    json: json,
    secure: this.options.secure,
    bigint: this.options.bigint,
    authorization: this.options.authorization,
    agent: this.options.agent,
    ipVersion: this.options.ipVersion,
    request: this.request,
  };
  return postJSON(params, callback);
};

/**
 * Search documents matching the `query`
 *
 * @param {Query|Object|String} query
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.search = function (query, callback) {
  return this.get(this.SELECT_HANDLER, query, callback);
};

/**
 * Execute an Admin Collections task on `collection`
 *
 * @param {Query|Object|String} collection
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.executeCollection = function (collection, callback) {
  return this.get(this.COLLECTIONS_HANDLER, collection, callback);
};

/**
 * Search for all documents
 *
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
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
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.spell = function (query, callback) {
  return this.get(this.SPELL_HANDLER, query, callback);
};

/**
 * Terms search
 *
 * Provides access to the indexed terms in a field and the number of documents that match each term.
 *
 * @param {Query|Object|String} query
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.termsSearch = function (query, callback) {
  return this.get(this.TERMS_HANDLER, query, callback);
};

/**
 * Send an arbitrary HTTP GET request to Solr on the specified `handler` (as Solr like to call it i.e path)
 *
 * @param {String} handler
 * @param {Query|Object|String} [query]
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.get = function (handler, query, callback) {
  let parameters = '';
  if (typeof query === 'function') {
    callback = query;
  } else if (query instanceof Query || query instanceof Collection) {
    parameters += query.build();
  } else if (typeof query === 'object') {
    parameters += querystring.stringify(query);
  } else if (typeof query === 'string') {
    parameters += query;
  }
  let pathArray;

  if (handler != 'admin/collections') {
    pathArray = [
      this.options.path,
      this.options.core,
      handler + '?' + parameters + '&wt=json',
    ];
  } else {
    pathArray = [this.options.path, handler + '?' + parameters + '&wt=json'];
  }

  const fullPath = pathArray
    .filter(function (element) {
      return element;
    })
    .join('/');

  const approxUrlLength =
    10 +
    Buffer.byteLength(this.options.host) +
    (this.options.port + '').length +
    Buffer.byteLength(fullPath); // Buffer (10) accounts for protocol and special characters like ://, port colon, and initial slash etc

  if (
    this.options.get_max_request_entity_size === false ||
    approxUrlLength <= this.options.get_max_request_entity_size
  ) {
    const params = {
      host: this.options.host,
      port: this.options.port,
      fullPath: fullPath,
      secure: this.options.secure,
      bigint: this.options.bigint,
      authorization: this.options.authorization,
      agent: this.options.agent,
      ipVersion: this.options.ipVersion,
      request: this.options.request,
    };

    return getJSON(params, callback);
  } else {
    // Funnel this through a POST because it's too large
    return this.post(handler, query, callback);
  }
};

/**
 * Send an arbitrary HTTP POST request to Solr on the specified `handler` (as Solr like to call it i.e path)
 *
 * @param {String} handler
 * @param {Query|Object|String} [query]
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */
Client.prototype.post = function (handler, query, callback) {
  let parameters = '';
  if (typeof query === 'function') {
    callback = query;
  } else if (query instanceof Query) {
    parameters += query.build();
  } else if (typeof query === 'object') {
    parameters += querystring.stringify(query);
  } else if (typeof query === 'string') {
    parameters += query;
  }

  let pathArray;

  if (handler != 'admin/collections') {
    pathArray = [this.options.path, this.options.core, handler + '?wt=json'];
  } else {
    pathArray = [this.options.path, handler + '?wt=json'];
  }

  const fullPath = pathArray
    .filter(function (element) {
      return element;
    })
    .join('/');

  const params = {
    host: this.options.host,
    port: this.options.port,
    fullPath: fullPath,
    params: parameters,
    secure: this.options.secure,
    bigint: this.options.bigint,
    authorization: this.options.authorization,
    agent: this.options.agent,
    ipVersion: this.options.ipVersion,
    request: this.options.request,
  };
  return postForm(params, callback);
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
 * NOTE: This method will be deprecated in the v0.6 release. Please use `Client.query()` instead.
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
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.ping = function (callback) {
  return this.get(this.ADMIN_PING_HANDLER, callback);
};

/**
 * HTTP POST request. Send update commands to the Solr server using form encoding (e.g. search)
 *
 * @param {Object} params
 * @param {String} params.host - IP address or host address of the Solr server
 * @param {Number|String} params.port - port of the Solr server
 * @param {String} params.core - name of the Solr core requested
 * @param {String} params.authorization - value of the authorization header
 * @param {String} params.fullPath - full path of the request
 * @param {String} params.params - form params
 * @param {Boolean} params.secure -
 * @param {Boolean} params.bigint -
 * @param {http.Agent} [params.agent] -
 * @param {Object} params.request - request options
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

function postForm(params, callback) {
  const headers = {
    'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    'content-length': Buffer.byteLength(params.params),
    accept: 'application/json; charset=utf-8',
  };
  if (params.authorization) {
    headers['authorization'] = params.authorization;
  }
  let options = {
    host: params.host,
    port: params.port,
    method: 'POST',
    headers: headers,
    path: params.fullPath,
    family: params.ipVersion,
  };

  if (params.request) {
    options = Object.assign(options, params.request);
  }

  if (params.agent !== undefined) {
    options.agent = params.agent;
  }

  const request = pickProtocol(params.secure).request(options);

  request.on('response', handleJSONResponse(request, params.bigint, callback));

  request.on('error', function onError(err) {
    if (callback) callback(err, null);
  });

  request.write(params.params);
  request.end();

  return request;
}

/**
 * HTTP GET request.  Send a query command to the Solr server (query)
 *
 * @param {Object} params
 * @param {String} params.host - IP address or host address of the Solr server
 * @param {Number|String} params.port - port of the Solr server
 * @param {String} params.core - name of the Solr core requested
 * @param {String} params.authorization - value of the authorization header
 * @param {String} params.fullPath - full path of the request, contains query parameters
 * @param {Boolean} params.secure -
 * @param {Boolean} params.bigint -
 * @param {http.Agent} [params.agent] -
 * @param {Object} params.request - request options
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

function getJSON(params, callback) {
  let headers = {
    accept: 'application/json; charset=utf-8',
  };
  let options = {
    host: params.host,
    port: params.port,
    path: params.fullPath,
    headers: headers,
    family: params.ipVersion,
  };

  if (params.request) {
    options = Object.assign(options, params.request);
  }

  if (params.agent !== undefined) {
    options.agent = params.agent;
  }

  if (params.authorization) {
    headers = {
      authorization: params.authorization,
    };
    options.headers = headers;
  }

  const request = pickProtocol(params.secure).get(options);

  request.on('response', handleJSONResponse(request, params.bigint, callback));

  request.on('error', function (err) {
    if (callback) callback(err, null);
  });
  return request;
}

Promise.promisifyAll(Client.prototype);
