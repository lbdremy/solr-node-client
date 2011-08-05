// Dependencies
var querystring = require('querystring');


// Expose 
exports.createQuery = function(){
   return new Query();
}

var Query = function(){
   this.parameters = [];
   this.query = '';
}

Query.prototype.defType = function(type){
   var self = this;
   var parameter = 'defType=' + type;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.dismax = function(){
   var self = this;
   var parameter = 'defType=dismax' ;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.q = function(infos){
   var self = this;
   
   var parameter ='q=';
   if ( typeof(infos) === 'string' ){
      parameter += infos.split().join('+');
   }else{
      parameter += querystring.stringify(infos, ' ',':');
   }
   this.parameters.push(parameter);
   return self;
}

Query.prototype.start = function(start){
   var self = this;
   var parameter = 'start=' + start ;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.rows = function(rows){
   var self = this;
   var parameter = 'rows=' + rows ;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.qf = function(params){
   var self = this;
   var parameter = 'qf=' ;
   parameter += querystring.stringify(params, ' ' , '^');
   this.parameters.push(parameter);
   return self;
}

Query.prototype.mm = function(minimum){
   var self = this;
   var parameter = 'mm=' + minimum;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.pf = function(params){
   var self = this;
   var parameter = 'pf=' ;
   parameter += querystring.stringify(params, ' ' , '^');
   this.parameters.push(parameter);
   return self;
}

Query.prototype.bq = function(params){
   var self = this;
   var parameter = 'bq=' ;
   parameter = querystring.stringify(params, ' ' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Used to sort a result in descending or ascending order depending of one or more fields.
 * 
 * @param {Object} params - An object is expected with the following structure { fieldName : 'asc|desc' , ... } 
 *
 */
 
Query.prototype.sort = function(params){
 var self = this;
 var parameter = 'sort=';
 parameter += querystring.stringify(params, ',' , ' ');
 this.parameters.push(parameter);
 return self;
}

/**
 * Used to specify a query that can be used to restrict the super set of documents that can be returned, without influencing score.
 * 
 * @param {Array|Object} params -  An object or an array are expected as following { field : 'name', start : '10' , end : '*|30' } [ {field : 'name' , start : '10' end : '*|30' } , ... ]
 * 
 */
 
Query.prototype.filter = function(params){
   var self = this;
   var parameter = 'fq=';
   if(params.length){
      var filters = params.map(function(param){
         var key = param.field;
         var filter = { key : '[' + param.start + 'TO' + param.end + ']' };
         return querystring.stringify(filter, '',':');
      });
      parameter += filters.join(' '); 
   }else{
      var key = params.field;
      var filter = { key : '[' + params.start + 'TO' + params.end + ']' };
      parameter += querystring.stringify(filter, '',':');
   }
   this.parameters.push(parameter);
   return self;
}

/**
 * Used to specify a set of fields to return, limiting the amount of information in the response. fl parameter in Solr. 
 * 
 * @param {string|Array} fields - one field name or an array of fields 
 */
 
Query.prototype.restrict = function(fields){
   var self = this;
   var parameter = 'fl=';
   if(typeof(fields) === 'string'){
      parameter += fields;
   }else{
      parameter += fields.join(',');
   }
   this.parameters.push(parameter);
   return self;
}

Query.prototype.timeAllowed = function(time){
   var self = this;
   var parameter = 'timeAllowed=' + time;
   this.parameters.push(parameter); 
   return self;
}

//TODO
Query.prototype.ps = function(){}

Query.prototype.qs = function(){}

Query.prototype.tie = function(){}

Query.prototype.bf = function(){}

Query.prototype.build = function(){
   return encodeURI(this.parameters.join('&'));
}
