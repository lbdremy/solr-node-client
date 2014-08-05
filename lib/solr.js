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
   Query = require('./query'),
   querystring = require('querystring'),
   format = require('./utils/format'),
   SolrError = require('./error/solr-error'),
   JSONStream = require('JSONStream'),
   duplexer = require('duplexer'),
   request = require('request'),
   FormData = require('form-data');

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
 *
 * @return {Client}
 * @api public
 */

function createClient(host, port, core, path, agent){
  var options = (typeof host === 'object')? host : {
      host : host,
      port : port,
      core : core,
      path : path,
      agent : agent
   };
  return new Client(options);
}

/**
 * Solr client
 * @constructor
 *
 * @param {Object} options - set of options used to request the Solr server
 * @param {String} options.host - IP address or host address of the Solr server
 * @param {Number|String} options.port - port of the Solr server
 * @param {String} options.core - name of the Solr core requested
 * @param {String} options.path - root path of all requests
 *
 * @return {Client}
 * @api private
 */

function Client(options){
   this.options = {
      host : options.host || '127.0.0.1',
      port : options.port || '8983',
      core : options.core || '',
      path : options.path || '/solr',
      agent : options.agent
   };

   // Default paths of all request handlers
   this.UPDATE_JSON_HANDLER = 'update/json';
   this.UPDATE_HANDLER = 'update';
   this.SELECT_HANDLER = 'select';
   this.ADMIN_PING_HANDLER = 'admin/ping';
   this.REAL_TIME_GET_HANDLER = 'get';
   this.SPELL_HANDLER = 'spell';
   this.EXTRACT_HANDLER = 'update/extract';
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

Client.prototype.basicAuth = function(username,password){
   var self = this;
   this.options.authorization = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
   return self;
}

/**
 * Remove authorization header
 *
 * @return {Client}
 * @api public
 */

Client.prototype.unauth = function(){
   var self = this;
   delete this.options.authorization;
   return self;
}

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

Client.prototype.add = function(docs,options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   docs = format.dateISOify(docs); // format `Date` object into string understable for Solr as a date.
   docs = Array.isArray(docs) ? docs : [docs];
   return this.update(docs,options,callback);
}

/**
 * Add a File's contents to the Solr index through the built-in extraction feature.  
 * Solr will use the Apache Tika library to extract the contents from the uploads.
 * See http://wiki.apache.org/solr/ExtractingRequestHandler. 
 * 
 * @param {String} path - path and filename of the file to add to the Solr index
 * @param {Object} [fields] - literal fields to add to the index-entry e.g. fields['id']
 * @param {Object} [options] - additional (optional) options to add e.g. options['fmap.content']
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.addFileContents = function(path,fields,options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   Object.keys(fields).forEach(function(key) {
       options['literal.'+key] = fields[key];
   });
       
   this.options.file = path;
   this.options.fullPath = [this.options.path,this.options.core, this.EXTRACT_HANDLER + '?' + querystring.stringify(options) +'&wt=json']
                              .filter(function(element){
                                 return element;
                              })
                              .join('/');
    
   return extractRequest(this.options,callback);
}

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

Client.prototype.realTimeGet = function(ids, query, callback){
   if(typeof query === 'function'){
      callback = query;
      query = {};
   }
   ids = Array.isArray(ids) ? ids : [ids];
   query.ids = ids.join(',');

   return this.get(this.REAL_TIME_GET_HANDLER,query,callback);
}

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

Client.prototype.addRemoteResource = function(options,callback){
   options.parameters = options.parameters || {};
   options.format = (options.format === 'xml' ? '' : options.format || ''); // reason: the default route of the XmlUpdateRequestHandle is /update and not /update/xml.
   options.parameters.commit = (options.parameters.commit === undefined ? false : options.parameters.commit);
   options.parameters['stream.contentType'] = options.contentType || 'text/plain;charset=utf-8';
   if(options.path.match(/^https?:\/\//)){
      options.parameters['stream.url'] = options.path;
   }else{
      options.parameters['stream.file'] = options.path;
   }

   var handler = this.UPDATE_HANDLER + '/' + options.format.toLowerCase();
   var query = querystring.stringify(options.parameters);
   return this.get(handler,query,callback);
}

/**
 * Create a writable/readable `Stream` to add documents into the Solr database
 *
 * @param {Object} [options] -
 *
 * return {Stream}
 * @api public
 */

Client.prototype.createAddStream = function(options){
   var path = [this.options.path,this.options.core, this.UPDATE_JSON_HANDLER + '?' + querystring.stringify(options) +'&wt=json']
      .filter(function(element){
         return element;
      })
      .join('/');
   var headers = {
      'content-type' : 'application/json',
      'charset' : 'utf-8'
   };
   if(this.options.authorization){
      headers['authorization'] = this.options.authorization;
   }
   var optionsRequest = {
      url : 'http://' + this.options.host +':' + this.options.port + path ,
      method : 'POST',
      headers : headers
   };
   var jsonStreamStringify = JSONStream.stringify();
   var postRequest = request(optionsRequest);
   jsonStreamStringify.pipe(postRequest);
   var duplex = duplexer(jsonStreamStringify,postRequest);
   return duplex ;
}

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

Client.prototype.commit = function(options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   var data = {
      commit : options || {}
   };
   return this.update(data,callback);
}

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

Client.prototype.prepareCommit = function(callback){
   return this.update({},{ prepareCommit : true},callback);
}

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

Client.prototype.softCommit = function(callback){
   return this.update({},{ softCommit : true},callback);
}

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

Client.prototype.delete = function(field,text,options,callback) {
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   text = format.dateISOify(text);
   var data = {
      'delete' :  {
         query : field +  ':'  + format.escapeSpecialChars(text)
      }
   };
   return this.update(data,options,callback);
}

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

Client.prototype.deleteByRange = function(field,start,stop,options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   start = format.dateISOify(start);
   stop = format.dateISOify(stop);

   var query = field + ':[' + start + ' TO ' + stop + ']';
   return this.deleteByQuery(query,options,callback);
}

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

Client.prototype.deleteByID = function(id,options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   var data = {
      'delete' : {
         id : id
      }
   };
   return this.update(data,options,callback);
}

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

Client.prototype.deleteByQuery = function(query,options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   var data = {
      'delete' : {
         query : query
      }
   };
   return this.update(data,options,callback);
}


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

Client.prototype.deleteAll = function(options,callback){
   return this.deleteByQuery('*:*',options,callback);
}

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

Client.prototype.optimize = function(options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   var data = {
      optimize : options || {}
   };
   return this.update(data,callback);
}

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

Client.prototype.rollback = function(callback){
   var data = {
      rollback : {}
   };
   return this.update(data,callback);
}

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

Client.prototype.update = function(data,options,callback){
   if(typeof(options) === 'function'){
      callback = options;
      options = {};
   }
   this.options.json = JSON.stringify(data);
   this.options.fullPath = [this.options.path,this.options.core, this.UPDATE_JSON_HANDLER + '?' + querystring.stringify(options) +'&wt=json']
                              .filter(function(element){
                                 return element;
                              })
                              .join('/');
   return postJSON(this.options,callback);
}

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

Client.prototype.search = function(query,callback){
   return this.get(this.SELECT_HANDLER, query, callback);
}

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

Client.prototype.searchAll = function(callback){
   return this.search('q=*', callback);
}

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

Client.prototype.spell = function(query,callback){
   return this.get(this.SPELL_HANDLER, query, callback);
}

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

Client.prototype.get = function(handler,query,callback){

   var parameters = '';
   if(typeof query === 'function'){
      callback = query;
   }else if(query instanceof Query){
      parameters += query.build();
   }else if(typeof query === 'object'){
      parameters += querystring.stringify(query);
   }else if(typeof query === 'string'){
      parameters += query;
   }

   this.options.fullPath = [this.options.path,this.options.core,handler + '?' + parameters + '&wt=json']
                              .filter(function(element){
                                 return element;
                              })
                              .join('/');
   return getJSON(this.options,callback);
}

/**
 * Create an instance of `Query`
 *
 * @return {Query}
 * @api public
 */

Client.prototype.createQuery = function(){
   return new Query();
}

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

Client.prototype.ping = function(callback){
   return this.get(this.ADMIN_PING_HANDLER, callback);
}

/**
 * HTTP POST request. Send update commands to the Solr server (commit, add, delete, optimize)
 *
 * @param {Object} params
 * @param {String} params.host - IP address or host address of the Solr server
 * @param {Number|String} params.port - port of the Solr server
 * @param {String} params.core - name of the Solr core requested
 * @param {String} params.authorization - value of the authorization header
 * @param {String} params.fullPath - full path of the request
 * @param {String} params.json
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

function postJSON(params,callback){
   var headers = {
      'content-type' : 'application/json; charset=utf-8',
      'content-length':  Buffer.byteLength(params.json),
      'accept' : 'application/json; charset=utf-8'
   };
   if(params.authorization){
      headers['authorization'] = params.authorization;
   }
   var options = {
      host : params.host,
      port : params.port,
      method : 'POST',
      headers : headers,
      path : params.fullPath
   };

   if(params.agent !== undefined){
      options.agent = params.agent;
   }

   var request = http.request(options);

   request.on('response', handleJSONResponse(request,callback));

   request.on('error',function onError(err){
      if (callback) callback(err,null);
   });

   request.write(params.json);
   request.end();

   return request;
};

/**
 * HTTP POST request with multipart/form-data for file upload to the Solr ExttractionHandler. 
 *
 * @param {Object} params
 * @param {String} params.host - IP address or host address of the Solr server
 * @param {Number|String} params.port - port of the Solr server
 * @param {String} params.core - name of the Solr core requested
 * @param {String} params.authorization - value of the authorization header
 * @param {String} params.fullPath - full path of the request
 * @param {String} params.file - path to the file to upload
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

var extractRequest = function(params,callback){
   var form = new FormData();

   form.append('my_file', fs.createReadStream(params.file));   
   var headers = form.getHeaders();
    
   if(params.authorization){
      headers['authorization'] = params.authorization;
   }
   var options = {
      host : params.host,
      port : params.port,
      method : 'POST',
      headers : headers,
      path : params.fullPath
   };

   if(params.agent !== undefined){
      options.agent = params.agent;
   }

   var callbackResponse = function(res){
      var buffer = '';
      var err = null;
      res.on('data',function(chunk){
         buffer += chunk;
      });

      res.on('end',function(){
         if(res.statusCode !== 200){
            err = new SolrError(res.statusCode,buffer);
            if (callback)  callback(err,null);
         }else{
            try{
               var data = JSON.parse(buffer);
            }catch(error){
               err = error;
            }finally{
               if (callback)  callback(err,data);
            }
         }
      });
   }

   var request = http.request(options,callbackResponse);
   form.pipe(request);

   request.on('error',function(err){
      if (callback) callback(err,null);
   });

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
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */

function getJSON(params,callback){
   var headers = {
      'accept' : 'application/json; charset=utf-8'
   };
   var options = {
      host : params.host,
      port : params.port,
      path : params.fullPath,
      headers : headers
   };

   if(params.agent !== undefined){
      options.agent = params.agent;
   }

    if(params.authorization){
      var headers = {
         'authorization' : params.authorization
      };
      options.headers = headers;
   }

   var request = http.get(options);

   request.on('response', handleJSONResponse(request,callback));

   request.on('error',function(err){
      if (callback) callback(err,null);
   });
   return request;
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

function handleJSONResponse(request, callback){
   return function onJSONResponse(response){
      var text = '';
      var err = null;
      var data = null;

      // This properly handles multi-byte characters
      response.setEncoding('utf-8');

      response.on('data',function(chunk){
         text += chunk;
      });

      response.on('end',function(){
         if(response.statusCode < 200 || response.statusCode > 299){
            err = new SolrError(request,response,text);
            if(callback)  callback(err,null);
         }else{
            try{
               data = JSON.parse(text);
            }catch(error){
               err = error;
            }finally{
               if(callback)  callback(err,data);
            }
         }
      });
   };
};
