/*!
 * solr client
 * Copyright(c) 2011-2012 HipSnip Limited
 * Author Rémy Loubradou <remyloubradou@gmail.com>
 * MIT Licensed
 */
 
/**
 * Load dependencies
 */

var http = require('http'),
   Query = require('./query'),
   format = require('./utils/format'),
   SolrError = require('./error/solr-error');

/**
 * Expose `createClient()`.
 */
 
exports.createClient = createClient

/**
 * Create an instance of `Client`
 * 
 * @param {String} [host='127.0.0.1'] - IP address or host address of the Solr server
 * @param {Number|String} [port='8983'] - port of the Solr server
 * @param {String} [core=''] - name of the Solr core requested
 * @param {String} [path='/solr'] - root path of all requests
 *
 * @return {Client}
 * @api public
 */

function createClient(host, port, core, path){
  var options = (arguments.length === 1 && typeof host === 'object')? host : {
      host : host,
      port : port,
      core : core,
      path : path
   };
  return new Client(options);
}

/**
 * Create a new `Client`
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
 
var Client = function(options){
   this.options = {
      host : options.host || '127.0.0.1',
      port : options.port || '8983',
      core : options.core || '',
      path : options.path || '/solr'
   };
   this.data = {};
   this.adds = [];
   this.autoCommit = false;
   this.updateEach = 1;
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
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api public 
 */ 

Client.prototype.add = function(doc,callback){
   var self = this;
   doc = format.dateISOify(doc); // format `Date` object into string understable for Solr as a date.
   doc instanceof Array ? this.adds.length === 0 ? this.adds = doc : this.adds.join(doc) : this.adds.push(doc);
   if(this.adds.length >= this.updateEach){
      this.update(this.adds,callback);
      this.adds.splice(0,this.adds.length); // Remove every elements
   }
   return self;
}

/**
 * Flush all documents still kept in `this.adds` array into the Solr database. Useful when you change the value of `this.updateEach`, call this function to be sure that every documents previously `add()` are now in the Solr database.
 *
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr servers
 *
 * @return {Client}
 * @api public  
 */

/**
 * @depracated `flashAdd()` and `purgeAdd()` since version 0.0.6. 
 */
Client.prototype.flashAdd = 
Client.prototype.purgeAdd =
Client.prototype.flushAdd = function(callback){
   var self = this;
   if(this.adds.length > 0){
      this.update(this.adds,callback);
      this.adds.splice(0,this.adds.length); // Remove every elements
   }else{
      var res = {"responseHeader":{"status":0,"QTime":1}}; // Emulated Solr response
      var err = null;
      callback(err,res);
   }
   return self;
}

/**
 * Commit last added and removed documents, that means your documents are now indexed.
 *
 * @param {Object} options 
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api private
 */ 
 
Client.prototype.commit = function(options,callback){
   if(callback === undefined){
      callback = options;
      options = undefined;
   }
   this.data = {};
   this.data['commit'] = {};
   
   if( options !== undefined ){
      var availableAttributes = ['waitFlush','waitSeacher'];
      for ( var i = 0; i < availableAttributes.length ; i++){
         if ( options[availableAttributes [i]] !== undefined ){
            this.data['commit'][availableAttributes[i]] = options[availableAttributes[i]];
         }
      }
   }
   this.update(this.data,callback);
}

/**
 * Delete documents based on the given `field` and `text`.
 *
 * @param {String} field
 * @param {String} text
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api public
 */ 
 
Client.prototype.delete = function(field,text,callback) {
   var self = this;
   text = format.dateISOify(text);
   this.data = {};
   this.data['delete'] =  {query : field +  ':'  + text};
   this.update(this.data,callback);
   return self;
}

/**
 * Delete a range of documents based on the given `field`, `start` and `stop` arguments.
 *
 * @param {String} field
 * @param {String|Date} start
 * @param {String|Date} stop
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api public
 */ 
 
Client.prototype.deleteByRange = function(field,start,stop,callback){
   var self = this;
   start = format.dateISOify(start);
   stop = format.dateISOify(stop);
   this.data = {};
   this.data['delete'] = { query : field + ':[' + start + ' TO ' + stop + ']' };
   this.update(this.data,callback);
   return self;
}

/**
 * Delete a document based on the given `id`
 *
 * @param {String|Number} id - id of the document you want to delete
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api public
 */ 
 
Client.prototype.deleteByID = function(id,callback){
   var self = this;
   this.data = {};
   this.data['delete'] =  {id : id.toString()};
   this.update(this.data,callback); 
   return self;
}

/**
 * Optimize the index
 *
 * @param {Object} options - 
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api public
 */ 
 
Client.prototype.optimize = function(options,callback){
   if(callback === undefined){
      callback = options;
      options = undefined;
   }
   this.data = {};
   this.data['optimize'] = {};
   if( options !== undefined ){
      var availableAttributes = ['waitFlush','waitSearcher'];
      for ( var i = 0; i < availableAttributes.length ; i++){
         if ( options[availableAttributes [i]] !== undefined ){
            this.data['optimize'][availableAttributes[i]] = options[availableAttributes[i]];
         }
      }
   }
   this.update(this.data,callback);
}

/**
 * Rollback all add/delete commands made since the last commit.
 *
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 * 
 * @return {Client}
 * @api public
 */
 
Client.prototype.rollback = function(callback){
   this.data = {};
   this.data['rollback'] = {};
   this.update(this.data,callback);
}

/**
 * Send an update command to the Solr server with the given `data` stringified in the body.
 *
 * @param {Object} data - data sent to the Solr server
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api private
 */
  
Client.prototype.update = function(data,callback){
   var self = this;
   this.options.json = JSON.stringify(data);
   this.options.fullPath = [this.options.path,this.options.core,'update/json?commit='+ this.autoCommit +'&wt=json']
                              .filter(function(element){
                                 if(element) return true;
                                 return false;    
                              })
                              .join('/');
   updateRequest(this.options,callback);
   return self;
}

/**
 * Send a query to the Solr server
 * 
 * @param {Query|String} query 
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api public
 */ 
 
Client.prototype.query = function(query,callback){
   var self = this;
   // Allow to be more flexible allow query to be a string and not only a Query object
   var parameters = query.build ? query.build() : query;
   this.options.fullPath = [this.options.path,this.options.core,'select?' + parameters + '&wt=json']
                              .filter(function(element){
                                 if(element) return true;
                                 return false;    
                              })
                              .join('/'); ;
   queryRequest(this.options,callback);
   return self;
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
 * Ping the Solr server
 *
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @return {Client}
 * @api public
 */
 
Client.prototype.ping = function(callback){
   var self = this;
   this.options.fullPath = [this.options.path,this.options.core,'admin/ping?wt=json']
                              .filter(function(element){
                                 if(element) return true;
                                 return false;    
                              })
                              .join('/');
   queryRequest(this.options,callback);
   return self;
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
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 *
 * @api private
 */
 
var updateRequest = function(params,callback){
   var headers = {
      'content-type' : 'application/json',
      'charset' : 'utf-8',
      'content-length':  Buffer.byteLength(params.json),
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
   
   var callbackResponse = function(res){
      var buffer = '';
      var err = null;
      res.on('data',function(chunk){
         buffer += chunk;
      });
      
      res.on('end',function(){
         if(res.statusCode !== 200){
            err = new SolrError(res.statusCode,buffer);
            // Clean the buffer
            buffer = '';
         }
         if (callback)  callback(err,buffer);
      });
   }
   
   var request = http.request(options,callbackResponse);
   
   request.on('error',function(err){
      if (callback) callback(err,null);
   });
   request.write(params.json);
   request.end();
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
 * @param {Function} callback(err,json) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {String} callback().json - JSON response sent by the Solr server
 * 
 * @api private
 */

var queryRequest = function(params,callback){
   var options = {
      host : params.host,
      port : params.port,
      path : params.fullPath
   };
   
   if(params.authorization){ 
      var headers = {
         'authorization' : params.authorization
      };
      options.headers = headers;
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
            // Clean the buffer
            buffer = '';
         }
         if (callback)  callback(err,buffer);
      });
   }
   
   var request = http.get(options,callbackResponse);
   
   request.on('error',function(err){ 
      if (callback) callback(err,null);
   });
}
