// Dependencies
var querystring = require('querystring'),
    format = require('./util/format');


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

Query.prototype.q = function(sentence){
   var self = this;
   
   var parameter ='q=';
   if ( typeof(sentence) === 'string' ){
      parameter += sentence.split().join('+');
   }else{
      parameter += querystring.stringify(sentence, ' ',':');
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

// Maximun number of rows returned in the result

Query.prototype.rows = function(rows){
   var self = this;
   var parameter = 'rows=' + rows ;
   this.parameters.push(parameter);
   return self;
}

/**
 * Query Fields
 *
 * List of fields and the "boosts" to associate with each of them when building DisjunctionMaxQueries from the user's query.
 *
 */
 
Query.prototype.qf = function(params){
   var self = this;
   var parameter = 'qf=' ;
   parameter += querystring.stringify(params, ' ' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Minimum 'Should' Match
 *
 */
 
Query.prototype.mm = function(minimum){
   var self = this;
   var parameter = 'mm=' + minimum;
   this.parameters.push(parameter);
   return self;
}

/**
 * Phrase Fields
 * 
 * Once the list of matching documents has been identified using the "fq" and "qf" params, the "pf" param can be used to "boost" the score of documents in cases where all of the terms 
 * in the "q" param appear in close proximity.
 *
 */
 
Query.prototype.pf = function(params){
   var self = this;
   var parameter = 'pf=' ;
   parameter += querystring.stringify(params, ' ' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Boost Query
 *
 * A raw query string (in the SolrQuerySyntax) that will be included with the user's query to influence the score. If this is a BooleanQuery 
 * with a default boost (1.0f) then the individual clauses will be added directly to the main query. Otherwise, the query will be included as is.
 *
 */
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
 * Used to specify a query that can be used to restrict the super set of documents that can be returned, without influencing score. Correspond to the fq parameter for Solr.
 * 
 * @param {Array|Object} params -  An object or an array are expected as following { field : 'name', start : '10' , end : '*|30' } [ {field : 'name' , start : '10' end : '*|30' } , ... ]
 * 
 */
 
Query.prototype.rangeFilter = function(params){
   var self = this;
   params = format.friendlyze(params);
   var parameter = 'fq=';
   if(params.length){
      var filters = params.map(function(param){
         var key = param.field;
         var filter = {};
         filter[key] = '[' + param.start + ' TO ' + param.end + ']';
         return querystring.stringify(filter, '',':');
      });
      parameter += filters.join(' '); 
   }else{
      var key = params.field;
      var filter = {};
      filter[key] = '[' + params.start + ' TO ' + params.end + ']';
      parameter += querystring.stringify(filter, '',':');
   }
   this.parameters.push(decodeURIComponent(parameter));
   return self;
}

Query.prototype.matchFilter = function(field,value){
   var self = this;
   value = format.friendlyze(value);
   var parameter = 'fq=';
   parameter += field + ':' + value;
   this.parameters.push(parameter);
   return self;
}

/**
 * Used to specify a set of fields to return, limiting the amount of information in the response. Correspond to the fl parameter for Solr. 
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

Query.prototype.timeout = function(time){
   var self = this;
   var parameter = 'timeAllowed=' + time;
   this.parameters.push(parameter); 
   return self;
}

/**
 * Shorcut command to groupBy a specified field
 * @param {String} - field name
 *
 * @return {Query}
 */
 
Query.prototype.groupBy = function(field){
   var self = this;
   this.group({
      'field':field
   });
   return self;
}

/**
 * Field Collapsing and Result Grouping.
 * @param {Object} options - properties considered 
 *    on : [Boolean] , // Default true
 *    field : [String],
 *    limit : [Number], // Default to 1, that's is a solr default value.
 *    offset : [Number],
 *    sort : [sortspec], // Default "score desc", solr default value
 *    format : [grouped|simple]
 *    main : [Boolean]
 *    ngroups : [Boolean], // Default false, solr default value
 *    truncate : [Boolean], // Default false, solr default value
 *    cache : [0-100] // Default is 0, solr default value
 *
 * @return {Query}
 */
 
Query.prototype.group = function(options){
   var self = this;
   this.parameters.push('group=' + (options.on || true)  );
   if( options.field ){
      this.parameters.push('group.field=' + options.field);
   }
   if( options.limit ){
      this.parameters.push('group.limit=' + options.limit);
   }
   if( options.offset ){
      this.parameters.push('group.offset=' + options.offset);
   }
   if( options.sort ){
      this.parameters.push('group.sort=' + options.sort);
   }
   if( options.format ){
      this.parameters.push('group.format=' + options.format);
   }
   if( options.main ){
      this.parameters.push('group.main=' + options.main);
   }
   if( options.ngroups ){
      this.parameters.push('group.ngroups=' + options.ngroups);
   }
   if( options.truncate ){
      this.parameters.push('group.truncate=' + options.truncate);
   }
   if( options.cache ){
      this.parameters.push('group.cache.percent=' + options.cache);
   }
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
