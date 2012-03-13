// Dependencies
var querystring = require('querystring'),
    format = require('./utils/format');


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

Query.prototype.q = function(q){
   var self = this;
   var parameter ='q=';
   if ( typeof(q) === 'string' ){
      parameter += encodeURIComponent(q);
   }else{
      parameter += querystring.stringify(q, '%20',':');
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
 
Query.prototype.qf = function(obj){
   var self = this;
   var parameter = 'qf=' ;
   parameter += querystring.stringify(obj, '%20' , '^');
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
 
Query.prototype.pf = function(obj){
   var self = this;
   var parameter = 'pf=' ;
   parameter += querystring.stringify(obj, '%20' , '^');
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
Query.prototype.bq = function(obj){
   var self = this;
   var parameter = 'bq=' ;
   parameter += querystring.stringify(obj, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Used to sort a result in descending or ascending order depending of one or more fields.
 * 
 * @param {Object} obj - An object is expected with the following structure { fieldName : 'asc|desc' , ... } 
 *
 */
 
Query.prototype.sort = function(obj){
 var self = this;
 var parameter = 'sort=';
 parameter += querystring.stringify(obj, ',' , '%20');
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
   params = format.dateISOify(params);
   var parameter = 'fq=';
   if(Array.isArray(params)){
      var filters = params.map(function(param){
         var key = param.field;
         var filter = {};
         filter[key] = '[' + encodeURIComponent(param.start) + '%20TO%20' + encodeURIComponent(param.end) + ']';
         return format.stringify(filter, '',':');
      });
      parameter += filters.join('%20'); 
   }else{
      var key = params.field;
      var filter = {};
      filter[key] = '[' + encodeURIComponent(params.start) + '%20TO%20' + encodeURIComponent(params.end) + ']';
      parameter += format.stringify(filter, '',':');
   }
   this.parameters.push(parameter);
   return self;
}

Query.prototype.matchFilter = function(field,value){
   var self = this;
   value = format.dateISOify(value);
   var parameter = 'fq=';
   parameter += field + ':' + encodeURIComponent(value);
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
      'field': field
   });
   return self;
}

/**
 * Use field collapsing or result grouping feature.
 * Field Collapsing collapses a group of results with the same field value down to a single (or fixed number) of entries.
 * Result Grouping groups documents with a common field value into groups, returning the top documents per group, and the top groups based on what documents are in the groups.
 *
 * @param {Object} options
 * @param {Boolean} [options.on=true] - if false, turn off result grouping, otherwise turn on.
 * @param {String} options.field - Group based on the unique values of a field. 
 * @param {Number} [options.limit=1] - The number of results (documents) to return for each group. Solr's default value is 1.
 * @param {Number} options.offset - The offset into the document list of each group.
 * @param {String} [options.sort="score desc"] - How to sort documents within a single group. Defaults to the same value as the sort parameter.
 * @param {String} options.format - if simple, the grouped documents are presented in a single flat list. The start and rows parameters refer to numbers of documents instead of numbers of groups.
 * @param {Boolean} options.main - If true, the result of the last field grouping command is used as the main result list in the response, using group.format=simple.
 * @param {Boolean} [options.ngroups=false] - If true, includes the number of groups that have matched the query. Default is false.
 * @param {Boolean} options.truncate - If true, facet counts are based on the most relevant document of each group matching the query. Same applies for StatsComponent. Default is false.
 * @param {Number}  [options.cache=0] - If > 0 enables grouping cache. Grouping is executed actual two searches. This option caches the second search. A value of 0 disables grouping caching. Default is 0.
 *
 * @returns {Query}
 */
 
Query.prototype.group = function(options){
   var self = this;
   if(options.on === false){
      this.parameters.push('group=false');
   }else{
      this.parameters.push('group=true');
   }
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
      this.parameters.push('group.sort=' + encodeURIComponent(options.sort));
   }
   if( options.format ){
      this.parameters.push('group.format=' + encodeURIComponent(options.format));
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

/**
 * Create a facet
 *
 * @param {Object} options - set of options to create a facet
 * @param {Boolean} [options.on=true] - Turn on or off facet
 * @param {String} options.query - This paramarater allows you to specify an arbitrary query in the Lucene default syntax to generate a facet count. By default, faceting returns a count of the unique terms for a "field", while facet.query allows you to determine counts for arbitrary terms or expressions.
 * @param {String} options.field - This parameter allows you to specify a field which should be treated as a facet. It will iterate over each Term in the field and generate a facet count using that Term as the constraint.
 * @param {String} options.prefix - Limits the terms on which to facet to those starting with the given string prefix.
 * @param {String} options.sort - This param determines the ordering of the facet field constraints.count
 * @param {Number} [options.limit=100] - This parameter indicates the maximum number of constraint counts that should be returned for the facet fields. A negative value means unlimited.The solr's default value is 100.
 * @param {Number} [options.offset=0] - This param indicates an offset into the list of constraints to allow paging.The solr's default value is 0.
 * @param {Number} [options.mincount=0] - This parameter indicates the minimum counts for facet fields should be included in the response. The solr's default value is 0.
 * @param {Boolean} [options.missing=false] - Set to `true` this param indicates that in addition to the Term based constraints of a facet field, a count of all matching results which have no value for the field should be computed. The solr's default value is false.
 * @param {String} [options.method="fc"] - This parameter indicates what type of algorithm/method to use when faceting a field.The solr's default value is fc (except for BoolField).
 *
 * @returns {Query}
 */
Query.prototype.facet = function(options){
   var self = this;
   if(options.on === false){
      this.parameters.push('facet=false');
   }else{
      this.parameters.push('facet=true');
   }
   if(options.query){
      this.parameters.push('facet.query=' + encodeURIComponent(options.query))
   }
   if(options.field){
      this.parameters.push('facet.field=' + options.field)
   }
   if(options.prefix){
      this.parameters.push('facet.prefix=' + encodeURIComponent(options.prefix))
   }
   if(options.sort){
      this.parameters.push('facet.sort=' + encodeURIComponent(options.sort))
   }
   if(options.limit){
      this.parameters.push('facet.limit=' + options.limit);
   }
   if(options.offset){
      this.parameters.push('facet.offset=' + options.offset);
   }
   if(options.mincount){
      this.parameters.push('facet.mincount=' + options.mincount);
   }
   if(options.missing){
      this.parameters.push('facet.missing=' + options.missing);
   }
   if(options.method){
      this.parameters.push('facet.method=' + options.method);
   }
   return self;
}

//TODO
Query.prototype.ps = function(){}

Query.prototype.qs = function(){}

Query.prototype.tie = function(){}

Query.prototype.bf = function(){}

Query.prototype.build = function(){
   return this.parameters.join('&');
}
