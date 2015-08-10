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

var http = require('http'),
    https = require('https'),
    Pool = require('poolee'),
    Query = require('./query'),
    querystring = require('querystring'),
    format = require('./utils/format'),
    SolrError = require('./error/solr-error'),
    JSONStream = require('JSONStream'),
    duplexer = require('duplexer'),
    request = require('request'),
    JSONbig = require('json-bigint');

/**
 * Expose `createClient()`.
 */

exports.createClient = createClient;

/**
 * Create an instance of `Client`
 *
 * @param {Array} [servers=['127.0.0.1:8983']] - Array of host:port
 * @param {String} [core=''] - name of the Solr core requested
 * @param {String} [path='/solr'] - root path of all requests
 * @param {Boolean} [secure=false] - if true HTTPS will be used instead of HTTP
 * @param {Boolean} [bigint=false] - if true JSONbig serializer/deserializer will be used instead
 *                                    of JSON native serializer/deserializer
 * @param {Object} [poolOptions={}] - set of options for poolee
 *
 * @return {Client}
 * @api public
 */

function createClient(servers, core, path, secure, bigint, poolOptions) {
    var options = (typeof servers === 'object' && !(servers instanceof Array)) ? servers : {
        servers: servers,
        core: core,
        path: path,
        secure: secure,
        bigint: bigint,
        poolOptions: poolOptions
    };
    return new Client(options);
}

/**
 * Solr client
 * @constructor
 *
 * @param {Object} options - set of options used to request the Solr server
 * @param {Array} options.servers - Array of host:port of the Solr servers
 * @param {String} options.core - name of the Solr core requested
 * @param {String} options.path - root path of all requests
 * @param {Boolean} [options.secure=false] - if true HTTPS will be used instead of HTTP
 * @param {Boolean} [options.bigint=false] - if true JSONbig serializer/deserializer will be used instead
 *                                    of JSON native serializer/deserializer
 * @param {Object} [poolpoints={}] - set of options for poolee
 * @return {Client}
 * @api private
 */

function Client(options) {
    this.options = {
        servers: options.servers || ['127.0.0.1:8983'],
        core: options.core || '',
        path: options.path || '/solr',
        bigint: options.bigint || false
    };
    var protocol = options.secure ? https : http;
    this.pool = new Pool(protocol, this.options.servers, options.poolOptions);

    // Default paths of all request handlers
    this.UPDATE_JSON_HANDLER = 'update/json';
    this.UPDATE_HANDLER = 'update';
    this.SELECT_HANDLER = 'select';
    this.ADMIN_PING_HANDLER = 'admin/ping';
    this.REAL_TIME_GET_HANDLER = 'get';
    this.SPELL_HANDLER = 'spell';
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

Client.prototype.basicAuth = function(username, password) {
    var self = this;
    this.options.authorization = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    return self;
};

/**
 * Remove authorization header
 *
 * @return {Client}
 * @api public
 */

Client.prototype.unauth = function() {
    var self = this;
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

Client.prototype.add = function(docs, options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
    docs = format.dateISOify(docs); // format `Date` object into string understable for Solr as a date.
    docs = Array.isArray(docs) ? docs : [docs];
    return this.update(docs, options, callback);
};

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

Client.prototype.realTimeGet = function(ids, query, callback) {
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

Client.prototype.addRemoteResource = function(options, callback) {
    options.parameters = options.parameters || {};
    options.format = (options.format === 'xml' ? '' : options.format || ''); // reason: the default route of the XmlUpdateRequestHandle is /update and not /update/xml.
    options.parameters.commit = (options.parameters.commit === undefined ? false : options.parameters.commit);
    options.parameters['stream.contentType'] = options.contentType || 'text/plain;charset=utf-8';
    if (options.path.match(/^https?:\/\//)) {
        options.parameters['stream.url'] = options.path;
    } else {
        options.parameters['stream.file'] = options.path;
    }

    var handler = this.UPDATE_HANDLER + '/' + options.format.toLowerCase();
    var query = querystring.stringify(options.parameters);
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

Client.prototype.createAddStream = function(options) {
    var path = [this.options.path, this.options.core, this.UPDATE_JSON_HANDLER + '?' + querystring.stringify(options) + '&wt=json']
        .filter(function(element) {
            return element;
        })
        .join('/');
    var headers = {
        'content-type': 'application/json',
        'charset': 'utf-8'
    };
    if (this.options.authorization) {
        headers.authorization = this.options.authorization;
    }
    var node = this.pool.get_node();
    var protocol = node.http === http ? 'http' : 'https';
    var optionsRequest = {
        url: protocol + '://' + node.ip + ':' + node.port + path,
        method: 'POST',
        headers: headers
    };
    var jsonStreamStringify = JSONStream.stringify();
    var postRequest = request(optionsRequest);
    jsonStreamStringify.pipe(postRequest);
    var duplex = duplexer(jsonStreamStringify, postRequest);
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

Client.prototype.commit = function(options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
    var data = {
        commit: options || {}
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

Client.prototype.prepareCommit = function(callback) {
    return this.update({}, {
        prepareCommit: true
    }, callback);
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

Client.prototype.softCommit = function(callback) {
    return this.update({}, {
        softCommit: true
    }, callback);
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

Client.prototype.delete = function(field, text, options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
    text = format.dateISOify(text);
    var data = {
        'delete': {
            query: field + ':' + format.escapeSpecialChars(text)
        }
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

Client.prototype.deleteByRange = function(field, start, stop, options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
    start = format.dateISOify(start);
    stop = format.dateISOify(stop);

    var query = field + ':[' + start + ' TO ' + stop + ']';
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

Client.prototype.deleteByID = function(id, options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
    var data = {
        'delete': {
            id: id
        }
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

Client.prototype.deleteByQuery = function(query, options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
    var data = {
        'delete': {
            query: query
        }
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

Client.prototype.deleteAll = function(options, callback) {
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

Client.prototype.optimize = function(options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
    var data = {
        optimize: options || {}
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

Client.prototype.rollback = function(callback) {
    var data = {
        rollback: {}
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

Client.prototype.update = function(data, options, callback) {
    var self = this;
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }

    var json = pickJSON(this.options.bigint).stringify(data);
    var fullPath = [this.options.path, this.options.core, this.UPDATE_JSON_HANDLER + '?' + querystring.stringify(options) + '&wt=json']
        .filter(function(element) {
            return element;
        })
        .join('/');

    var params = {
        fullPath: fullPath,
        json: json,
        bigint: this.options.bigint,
        authorization: this.options.authorization
    };
    return self.postJSON(params, callback);
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

Client.prototype.search = function(query, callback) {
    return this.get(this.SELECT_HANDLER, query, callback);
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

Client.prototype.searchAll = function(callback) {
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

Client.prototype.spell = function(query, callback) {
    return this.get(this.SPELL_HANDLER, query, callback);
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

Client.prototype.get = function(handler, query, callback) {

    var parameters = '',
        self = this;
    if (typeof query === 'function') {
        callback = query;
    } else if (query instanceof Query) {
        parameters += query.build();
    } else if (typeof query === 'object') {
        parameters += querystring.stringify(query);
    } else if (typeof query === 'string') {
        parameters += query;
    }

    var fullPath = [this.options.path, this.options.core, handler + '?' + parameters + '&wt=json']
        .filter(function(element) {
            return element;
        })
        .join('/');

    var params = {
        fullPath: fullPath,
        bigint: this.options.bigint,
        authorization: this.options.authorization
    };
    return self.getJSON(params, callback);
};

/**
 * Create an instance of `Query`
 *
 * @return {Query}
 * @api public
 */

Client.prototype.createQuery = function() {
    return new Query();
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

Client.prototype.ping = function(callback) {
    return this.get(this.ADMIN_PING_HANDLER, callback);
};


/**
 * Pick appropriate JSON serializer/deserializer library based on the given `bigint` flag
 * @param {Boolean} bigint - whenever to handle big number correctly or not (the reason for not using JSONbig all the times is it has an important performance cost)
 * @return {Object} JSON or JSONbig serializer/deserializer
 * @api private
 */

function pickJSON(bigint) {
    return bigint ? JSONbig : JSON;
}

/**
 * HTTP POST request. Send update commands to the Solr server (commit, add, delete, optimize)
 *
 * @param {Object} params
 * @param {String} params.core - name of the Solr core requested
 * @param {String} params.authorization - value of the authorization header
 * @param {String} params.fullPath - full path of the request
 * @param {String} params.json -
 * @param {Boolean} params.secure -
 * @param {Boolean} params.bigint -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

Client.prototype.postJSON = function(params, callback) {
    var self = this;
    var headers = {
        'content-type': 'application/json; charset=utf-8',
        'content-length': Buffer.byteLength(params.json),
        'accept': 'application/json; charset=utf-8'
    };
    if (params.authorization) {
        headers.authorization = params.authorization;
    }
    var options = {
        method: 'POST',
        headers: headers,
        path: params.fullPath
    };

    self.pool.request(options, params.json, function(err, response, body) {
        if (err) {
            callback(err);
        } else {
            handleJSONResponse(response, body, params.bigint, callback);
        }
    });
    return options;
};

/**
 * HTTP GET request.  Send a query command to the Solr server (query)
 *
 * @param {Object} params
 * @param {String} params.core - name of the Solr core requested
 * @param {String} params.authorization - value of the authorization header
 * @param {String} params.fullPath - full path of the request, contains query parameters
 * @param {Boolean} params.secure -
 * @param {Boolean} params.bigint -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

Client.prototype.getJSON = function(params, callback) {
    var self = this;
    var headers = {
        'accept': 'application/json; charset=utf-8'
    };
    var options = {
        method: 'GET',
        path: params.fullPath,
        headers: headers
    };

    if (params.authorization) {

        headers.authorization = params.authorization;
        options.headers = headers;
    }

    self.pool.request(options, function(err, response, body) {
        if (err) {
            callback(err, null);
        } else {
            handleJSONResponse(response, body, params.bigint, callback);
        }
    });
    return options;
};

/**
 * Handle HTTP JSON response from Solr
 *
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @api private
 */

function handleJSONResponse(response, body, bigint, callback) {
    var err = null;
    var data = null;
    var request = response.req;
    // This properly handles multi-byte characters
    response.setEncoding('utf-8');
    if (response.statusCode < 200 || response.statusCode > 299) {
        err = new SolrError(request, response, body);
        if (callback) callback(err, null);
    } else {
        try {
            data = pickJSON(bigint).parse(body);
        } catch (error) {
            err = error;
        } finally {
            if (callback) callback(err, data);
        }
    }
}