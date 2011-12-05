/**
 * Load dependencies
 */

var http = require('http'),
   errorParser = require('./error/parser'),
   query = require('./query'),
   format = require('./util/format');

/**
 * Factory to create an instance of Client (Exposed)
 * 
 * @param {Object} host - IP address or host address of the Solr Server
 * @param {Object} port - port of the Solr Server
 * @param {Object} core - name of the Solr Core requested
 * @param {Object} path - path used for send requests to the Solr Server
 *
 * @return {Client Object}
 */
exports.createClient = function(host, port, core, path){
  var options = { 
      host : host || '127.0.0.1',
      port : port || '8983',
      core : core || '',
      path : path || '/solr'
   };
  return new Client(options);
}

/**
 *
 * @constructor
 * @this {Client}
 * @param {Object} options - Set of parameters used for the connection to the Solr Server
 * 
 */
 
var Client = function(options){
   this.options = options;
   this.data = {};
   this.adds = [];
   this.autoCommit = false;
   this.updateEach = 1;
}

/**
 * Add (a) document(s) to the Solr Database
 * 
 * @param {Object} doc - Document added to the Solr Database
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object} 
 */ 

Client.prototype.add = function(doc,callback){
   var self = this;
   doc = format.friendlyze(doc); // Format Date object into string understable for Solr as a date. 
   this.adds.push(doc);
   if(this.adds.length >= this.updateEach){
      this.update(this.adds,callback);
      this.adds.splice(0,this.adds.length); // Remove every elements
   }
   return self;
}

/**
 * Add last documents to the Solr Database still kept in the array of added document (usefull when you ask the client to    updateEach X documents, call this function to be sure every single document add are now update on the Solr Database)
 *
 * @param {Function} callback - Function to execute when the Sorl's Server responds or an error occurs
 *
 * @return {Client Object}  
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
 * Commit last added and removed documents in the Solr Database, it's mean your documents are now indexed.
 *
 * @param {Object} options - 
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object}
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
 * Delete a document present in the Solr Database
 *
 * @param {Object} field - 
 * @param {Object} text -
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object}
 */ 
 
Client.prototype.delete = function(field,text,callback) {
   var self = this;
   text = format.friendlyze(text);
   this.data = {};
   this.data['delete'] =  {query : field +  ':'  + text};
   this.update(this.data,callback);
   return self;
}

/**
 * Delete a range of documents present in the Solr Database
 *
 * @param {Object} field - 
 * @param {Object} start - Format expected for a date: yyyy-mm-ddThh:mm:ss.mmmZ (ex:2011-09-06T11:00:25.083Z)
 * @param {Object} stop -
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object}
 */ 
 
Client.prototype.deleteByRange = function(field,start,stop,callback){
   var self = this;
   start = format.friendlyze(start);
   stop = format.friendlyze(stop);
   this.data = {};
   this.data['delete'] = { query : field + ':[' + start + ' TO ' + stop + ']' };
   this.update(this.data,callback);
   return self;
}

/**
 * Delete a document present in the Solr Database regarding of the id field.
 *
 * @param {Object} id - ID of the document you want to delete
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object}
 */ 
 
Client.prototype.deleteByID = function(id,callback){
   var self = this;
   this.data = {};
   this.data['delete'] =  {id : id.toString()};
   this.update(this.data,callback); 
   return self;
}

/**
 * Optimize the index of the Solr Database
 *
 * @param {Object} options - 
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object}
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
 * Rollbacks all add/deletes made to the index since the last commit.
 *
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 * 
 * @return {Client Object}
 */
 
Client.prototype.rollback = function(callback){
   this.data = {};
   this.data['rollback'] = {};
   this.update(this.data,callback);
}

/**
 * Update document(s) with the parameter `data` in the Solr Database
 *
 * @param {Object} data - object send to the Solr Database
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object}
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
 * Query the Solr Database
 * 
 * @param {Object} field - Field used for the research
 * @param {Object} text - Text that the research will try to match
 * @param {Number} start - Index of the first document retrieved
 * @param {Number} rows - Number of rows retrieved by the query
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 *
 * @return {Client Object}
 */ 
 
Client.prototype.query = function(query,callback){
   var self = this;
   this.options.fullPath = [this.options.path,this.options.core,'select?' + query.build() + '&wt=json']
                              .filter(function(element){
                                 if(element) return true;
                                 return false;    
                              })
                              .join('/'); ;
   queryRequest(this.options,callback);
   return self;
}

/**
 * Query the Solr Database using the Dismax Request Handler
 * 
 * @param 
 *
 * @return {Query Object}
 */
 
Client.prototype.createQuery = function(){
   return query.createQuery();
}

/**
 * HTTP POST Request to handle Update of the Solr Database (commit, add, delete, optimize)
 * 
 * @param {Object} configs - Set of parameters for the connection to the Solr Server and data sent.
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 */
 
var updateRequest = function(configs,callback){
   var headers = {
      "content-type" : "application/json",
      "charset" : "utf-8",
      "content-length":  Buffer.byteLength(configs.json)
   }
   var options = {
      host : configs.host,
      port : configs.port,
      method : 'POST',
      headers : headers,
      path : configs.fullPath 
   }
   var callbackResponse = function(res){
      var err = res.statusCode === 200 ? null : res.statusCode;
      var buffer = '';
      res.on('data',function(chunk){
         buffer += chunk;
      });
      
      res.on('end',function(){
         if(err){
            errorParser.report(buffer,function(msg){
               err = new Error(msg);
            });
         }
         if (callback)  callback(err,buffer);
      });
   }
   var request = http.request(options,callbackResponse);
   
   request.on('error',function(err){
      if (callback) callback(err,null);
   });
   request.write(configs.json);
   request.end();
}

/**
 * HTTP GET Request to handle Query(ies) on the Solr Database (query)
 * 
 * @param {Object} configs - Set of parameters for the connection to the Solr Server and data sent.
 * @param {Function} callback - Function to execute when the Solr Server responds or an error occurs
 */

var queryRequest = function(configs,callback){
   var options = {
      host : configs.host,
      port : configs.port,
      path : configs.fullPath
   }
   
    var callbackResponse = function(res){
      var err = res.statusCode === 200 ? null : res.statusCode;
      var buffer = '';
      res.on('data',function(chunk){
         buffer += chunk;
      });
      
      res.on('end',function(){
         if(err){
            errorParser.report(buffer,function(msg){
               err = new Error(msg);
            });
         }
         if (callback)  callback(err,buffer);
      });
   }
   
   var request = http.get(options,callbackResponse);
   
   request.on('error',function(err){ 
      if (callback) callback(err,null);
   });
}
