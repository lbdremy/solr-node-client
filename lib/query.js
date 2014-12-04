/**
 * Load dependencies
 */
var querystring = require('querystring'),
    format = require('./utils/format');

/**
 * Expose `Query`
 */

module.exports = exports = Query;

/**
 * Create a new `Query`
 * @constructor
 *
 * @return {Query}
 * @api private
 */

function Query(){
   this.parameters = [];
}

/**
 * Set a new parameter
 * Since all possibilities provided by Solr are not available in the `Query` object, `set()` is there to fit this gap.
 *
 * @param {String} parameter - string, special characters have to be correctly encoded or the request will fail.
 *
 * @return {Query} - allow chaining
 * @api public
 */
Query.prototype.set = function(parameter){
   var self = this;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the query parser to use with this request.
 *
 * @param {String} type - name of the query parser e.g: 'dismax'
 *
 * @return {Query}
 * @api public
 */

Query.prototype.defType = function(type){
   var self = this;
   var parameter = 'defType=' + type;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Request Handler used to process the request based on its `name`.
 * Works only if no Request Handler has been configured with `/select` as its name in solrconfig.xml.
 *
 * @param {String} name - name of the Request Handler
 *
 * @return {Query}
 * @api public
 */

Query.prototype.requestHandler =
Query.prototype.qt = function(name){
  var self = this;
  var parameter = 'qt=' + name;
  this.parameters.push(parameter);
  return self;
}

/**
 *  Set the main query
 *
 * @param {String|Object} q -
 *
 * @return  {Query}
 * @api public
 */

Query.prototype.q = function(q){
   var self = this;
   var parameter ='q=';
   if ( typeof(q) === 'string' ){
      parameter += encodeURIComponent(q);
   }else{
      parameter += querystring.stringify(q, '%20AND%20',':');
   }
   this.parameters.push(parameter);
   return self;
}

/**
 *  Set the default query operator
 *
 * @param {String} op -
 *
 * @return  {Query}
 * @api public
 */

Query.prototype.qop = function(op){
    var self = this;
    var parameter ='q.op=';
    parameter += op;
    this.parameters.push(parameter);
    return self;
};

/**
 * Set the offset where the set of returned documents should begin.
 *
 * @param {Number} start - the offset where the set of returned documents should begin.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.start = function(start){
   var self = this;
   var parameter = 'start=' + start ;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the maximum number of documents returned
 *
 * @param {Number} rows - number of documents
 *
 * @return {Query}
 * @api public
 */
Query.prototype.rows = function(rows){
   var self = this;
   var parameter = 'rows=' + rows ;
   this.parameters.push(parameter);
   return self;
}

/**
 * Request to use cursorMarks for deep-paging as explained in http://heliosearch.org/solr/paging-and-deep-paging/
 * Note that usage of a cursor requires a sort containing a uniqueKey field tie breaker
 *
 * @param {String} mark - The mark to use, defaults to "*" to request a new cursor in the first request
 *
 * @return {Query}
 * @api public
 */
Query.prototype.cursorMark = function(mark){
   var self = this;
   mark = mark || "*";
   var parameter = 'cursorMark=' + mark ;
   this.parameters.push(parameter);
   return self;
}

/**
 * Sort a result in descending or ascending order based on one or more fields.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.sort = function(options){
   var self = this;
   var parameter = 'sort=';
   parameter += querystring.stringify(options, ',' , '%20');
   this.parameters.push(parameter);
   return self;
}

/**
 * Filter the set of documents found before to return the result with the given range determined by `field`, `start` and `end`.
 *
 * @param {Array|Object} options -
 * @param {String} options.field - the name of the field where the range is applied
 * @param {String|Number|Date} options.start - the offset where the range starts
 * @param {String|Number|Date} options.end - the offset where the range ends
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.q({ '*' : '*' }).rangeFilter({ field : 'id', start : 100, end : 200})
 * // also works
 * query.q({ '*' : '*' }).rangeFilter([{ field : 'id', start : 100, end : 200},{ field : 'date', start : new Date(), end : new Date() - 3600}]);
 */

Query.prototype.rangeFilter = function(options){
   var self = this;
   options = format.dateISOify(options);
   var parameter = 'fq=';
   if(Array.isArray(options)){
     parameter += "(";
      var filters = options.map(function(option){
         var key = option.field;
         var filter = {};
         filter[key] = '[' + encodeURIComponent(option.start) + '%20TO%20' + encodeURIComponent(option.end) + ']';
         return format.stringify(filter, '',':');
      });
      parameter += filters.join('%20AND%20');
      parameter += ")";
   }else{
      var key = options.field;
      var filter = {};
      filter[key] = '[' + encodeURIComponent(options.start) + '%20TO%20' + encodeURIComponent(options.end) + ']';
      parameter += format.stringify(filter, '',':');
   }
   this.parameters.push(parameter);
   return self;
}

/**
 * Filter the set of documents found before to return the result with the given `field` and `value`.
 *
 * @param {String} field - name of field
 * @param {String|Number|Date} value - value of the field that must match
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.q({ '*' : '*' }).matchFilter('id', 100)
 */

Query.prototype.matchFilter = function(field,value){
   var self = this;
   value = format.dateISOify(value);
   var parameter = 'fq=';
   parameter += field + ':' + encodeURIComponent(value);
   this.parameters.push(parameter);
   return self;
}

/**
 * Specify a set of fields to return.
 *
 * @param {String|Array} field - field name
 *
 * @return {Query}
 * @api public
 */

Query.prototype.fl =
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

/**
 * Set the time allowed for a search to finish.
 * Partial results may be returned (if there are any).
 *
 * @param {String|Number} time - time is in milliseconds. Values <= 0 mean no time restriction.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.timeout = function(time){
   var self = this;
   var parameter = 'timeAllowed=' + time;
   this.parameters.push(parameter);
   return self;
}

/**
 * Group documents with the given `field`
 *
 * @param {String} field - field name
 *
 * @return {Query}
 * @api public
 */

Query.prototype.groupBy = function(field){
   var self = this;
   this.group({
      'field': field
   });
   return self;
}

/**
 * Group documents using field collapsing or result grouping feature.
 * Field Collapsing collapses a group of results with the same field value down to a single (or fixed number) of entries.
 * Result Grouping groups documents with a common field value into groups, returning the top documents per group, and the top groups based on what documents are in the groups.
 *
 * @param {Object} options
 * @param {Boolean} [options.on=true] - if false, turn off result grouping, otherwise turn on.
 * @param {String|Array} options.field - Group based on the unique values of a field.
 * @param {Number} [options.limit=1] - The number of results (documents) to return for each group. Solr's default value is 1.
 * @param {Number} options.offset - The offset into the document list of each group.
 * @param {String} [options.sort="score desc"] - How to sort documents within a single group. Defaults to the same value as the sort parameter.
 * @param {String} options.format - if simple, the grouped documents are presented in a single flat list. The start and rows parameters refer to numbers of documents instead of numbers of groups.
 * @param {Boolean} options.main - If true, the result of the last field grouping command is used as the main result list in the response, using group.format=simple.
 * @param {Boolean} [options.ngroups=false] - If true, includes the number of groups that have matched the query. Default is false.
 * @param {Boolean} options.truncate - If true, facet counts are based on the most relevant document of each group matching the query. Same applies for StatsComponent. Default is false.
 * @param {Number}  [options.cache=0] - If > 0 enables grouping cache. Grouping is executed actual two searches. This option caches the second search. A value of 0 disables grouping caching. Default is 0.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.group = function(options){
   var self = this;
   if(options.on === false){
      this.parameters.push('group=false');
   }else{
      this.parameters.push('group=true');
   }
   if( options.field ){
      if(!Array.isArray(options.field)){
        options.field = [options.field];
      }
      options.field.forEach(function(field){
        self.parameters.push('group.field=' + field);
      });
   }
   if( options.limit !== undefined){
      this.parameters.push('group.limit=' + options.limit);
   }
   if( options.offset !== undefined){
      this.parameters.push('group.offset=' + options.offset);
   }
   if( options.sort ){
      this.parameters.push('group.sort=' + encodeURIComponent(options.sort));
   }
   if( options.format ){
      this.parameters.push('group.format=' + encodeURIComponent(options.format));
   }
   if( options.main !== undefined){
      this.parameters.push('group.main=' + options.main);
   }
   if( options.ngroups !== undefined){
      this.parameters.push('group.ngroups=' + options.ngroups);
   }
   if( options.truncate !== undefined){
      this.parameters.push('group.truncate=' + options.truncate);
   }
   if( options.cache !== undefined){
      this.parameters.push('group.cache.percent=' + options.cache);
   }
   return self;
}

/**
 * Create a facet
 *
 * @param {Object} options - set of options to create a facet
 * @param {Boolean} [options.on=true] - Turn on or off facet
 * @param {String} [options.query] - This parameter allows you to specify an arbitrary query in the Lucene default syntax to generate a facet count. By default, faceting returns a count of the unique terms for a "field", while facet.query allows you to determine counts for arbitrary terms or expressions.
 * @param {String|Array} options.field - This parameter allows you to specify a field which should be treated as a facet. It will iterate over each Term in the field and generate a facet count using that Term as the constraint. Multiple fields can be defined providing an array instead of a string.
 * @param {String} [options.prefix] - Limits the terms on which to facet to those starting with the given string prefix.
 * @param {String} [options.sort] - This param determines the ordering of the facet field constraints.count
 * @param {Number} [options.limit=100] - This parameter indicates the maximum number of constraint counts that should be returned for the facet fields. A negative value means unlimited.The solr's default value is 100.
 * @param {Number} [options.offset=0] - This param indicates an offset into the list of constraints to allow paging.The solr's default value is 0.
 * @param {Number} [options.mincount=0] - This parameter indicates the minimum counts for facet fields should be included in the response. The solr's default value is 0.
 * @param {Boolean} [options.missing=false] - Set to `true` this param indicates that in addition to the Term based constraints of a facet field, a count of all matching results which have no value for the field should be computed. The solr's default value is false.
 * @param {String} [options.method="fc"] - This parameter indicates what type of algorithm/method to use when faceting a field.The solr's default value is fc (except for BoolField).
 *
 * @return {Query}
 * @api public
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
      if(!Array.isArray(options.field)){
         options.field = [options.field];
      }
      for (var i = 0; i < options.field.length; i++) {
         this.parameters.push('facet.field=' + options.field[i])
      }
   }
   if(options.prefix){
      this.parameters.push('facet.prefix=' + encodeURIComponent(options.prefix))
   }
   if(options.sort){
      this.parameters.push('facet.sort=' + encodeURIComponent(options.sort))
   }
   if(options.limit !== undefined){
      this.parameters.push('facet.limit=' + options.limit);
   }
   if(options.offset !== undefined){
      this.parameters.push('facet.offset=' + options.offset);
   }
   if(options.mincount !== undefined){
      this.parameters.push('facet.mincount=' + options.mincount);
   }
   if(options.missing !== undefined){
      this.parameters.push('facet.missing=' + options.missing);
   }
   if(options.method){
      this.parameters.push('facet.method=' + options.method);
   }
   return self;
}

/**
 * Create a MoreLikeThis. MoreLikeThis constructs a lucene query based on terms within a document.
 *
 * @param {Object} options - set of options to create a morelikethis
 * @param {Boolean} [options.on=true] - Turn on or off morelikethis
 * @param {String|Array} [options.fl] - The fields to use for similarity. NOTE: if possible, these should have a stored TermVector
 * @param {Number} [options.count] - The number of similar documents to return for each result.
 * @param {Number} [options.mintf] - Minimum Term Frequency - the frequency below which terms will be ignored in the source doc.
 * @param {Number} [options.mindf] - Minimum Document Frequency - the frequency at which words will be ignored which do not occur in at least this many docs.
 * @param {Number} [options.minwl] - minimum word length below which words will be ignored.
 * @param {Number} [options.maxwl] - maximum word length above which words will be ignored.
 * @param {Number} [options.maxqt] - maximum number of query terms that will be included in any generated query.
 * @param {Number} [options.maxntp] - maximum number of tokens to parse in each example doc field that is not stored with TermVector support.
 * @param {Boolean} [options.boost] - set if the query will be boosted by the interesting term relevance.
 * @param {String|Object} [options.qf] - Query fields and their boosts using the same format as that used in DisMaxQParserPlugin. These fields must also be specified in mlt.fl.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.mlt = function(options){
  var self = this;
  if(options.on === false){
    this.parameters.push('mlt=false');
  }else{
    this.parameters.push('mlt=true');
  }
  if(options.fl){
    if(options.fl instanceof Array) options.fl = options.fl.join(',');
    this.parameters.push('mlt.fl=' + encodeURIComponent(options.fl))
  }
  if(options.count !== undefined){
    this.parameters.push('mlt.count=' + options.count)
  }
  if(options.mintf !== undefined){
    this.parameters.push('mlt.mintf=' + options.mintf)
  }
  if(options.mindf !== undefined){
    this.parameters.push('mlt.mindf=' + options.mindf);
  }
  if(options.minwl !== undefined){
    this.parameters.push('mlt.minwl=' + options.minwl)
  }
  if(options.maxwl !== undefined ){
    this.parameters.push('mlt.maxwl=' + options.maxwl)
  }
  if(options.maxqt !== undefined){
    this.parameters.push('mlt.maxqt=' + options.maxqt)
  }
  if(options.maxntp !== undefined){
    this.parameters.push('mlt.maxntp=' + options.maxntp);
  }
  if(options.boost !== undefined){
    this.parameters.push('mlt.boost=' + options.boost);
  }
  if(options.qf){
    if( typeof options.qf === 'object'){
      var parameter = querystring.stringify(options.qf, '%20' , '^');;
    }else{
      var parameter = encodeURIComponent(options.qf);
    }
    this.parameters.push('mlt.qf=' + parameter);
  }
  return self;
}

/*!
 * DisMax parameters
 * do not forget to use `.dismax()` when using these parameters
 */

/**
 * Use the DisMax query parser
 *
 * @return {Query}
 * @api public
 */

Query.prototype.dismax = function(){
   var self = this;
   this.defType('dismax');
   return self;
}

/*!
 * EDisMax parameters
 * do not forget to use `.edismax()` when using these parameters
 */

/**
 * Use the EDisMax query parser
 *
 * @return {Query}
 * @api public
 */

Query.prototype.edismax = function(){
   var self = this;
   this.defType('edismax');
   return self;
}

/**
 * Add the parameter debugQuery.
 * Additional debugging informations will be available in the response.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.debugQuery = function(){
   var self = this;
   this.parameters.push('debugQuery=true');
   return self;
}

//TODO
Query.prototype.ps = function(){}

/**
 * Set the "boosts" to associate with each fields
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.qf({title : 2.2, description : 0.5 });
 */

Query.prototype.qf = function(options){
   var self = this;
   var parameter = 'qf=' ;
   parameter += querystring.stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the minimum number or percent of clauses that must match.
 *
 * @param {String|Number} minimum - number or percent of clauses that must match
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.mm(2); // or query.mm('75%');
 */

Query.prototype.mm = function(minimum){
   var self = this;
   var parameter = 'mm=' + minimum;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Phrase Fields parameter.
 * Once the list of matching documents has been identified using the "fq" and "qf" params, the "pf" param can be used to "boost" the score of documents in cases where all of the terms
 * in the "q" param appear in close proximity.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.pf = function(options){
   var self = this;
   var parameter = 'pf=' ;
   parameter += querystring.stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the phrase slop allowed in a query.
 *
 * @param {Number} slop - Amount of phrase slop allowed by the query filter. This value should represent the maximum number of words allowed between words in a field that match a phrase in the query.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.ps = function(slop){
   var self = this;
   var parameter = 'ps=' + slop;
   this.parameters.push(parameter);
   return self;
};

/**
 * Set the query slop allowed in a query.
 *
 * @param {Number} slop - Amount of query slop allowed by the query filter. This value should be used to affect boosting of query strings.
 *
 * @return {Query}
 * @api public
 */
Query.prototype.qs = function(slop){
   var self = this;
   var parameter = 'qs=' + slop;
   this.parameters.push(parameter);
   return self;
};

/**
 * Set the tiebreaker in DisjunctionMaxQueries (should be something much less than 1)
 *
 * @param {Float|Number} tiebreaker -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.tie = function(tiebreaker){
   var self = this;
   var parameter = 'tie=' + tiebreaker;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Boost Query parameter.
 * A raw query string (in the SolrQuerySyntax) that will be included with the user's query to influence the score. If this is a BooleanQuery with a default boost (1.0f) then the individual clauses will be added directly to the main query. Otherwise, the query will be included as is.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.bq = function(options){
   var self = this;
   var parameter = 'bq=' ;
   parameter += querystring.stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}


/**
 * Set the Functions (with optional boosts) that will be included in the user's query to influence the score.
 * @param {String} functions - e.g.: `recip(rord(myfield),1,2,3)^1.5`
 *
 * @return {Query}
 * @api public
 */

Query.prototype.bf = function(functions){
   var self = this;
   var parameter = 'bf=' + functions;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Functions (with optional boosts) that will be included in the user's query to influence the score.
 * @param {String} functions - e.g.: `recip(rord(myfield),1,2,3)^1.5`
 *
 * @return {Query}
 * @api public
 */

Query.prototype.boost = function(functions){
   var self = this;
   var parameter = 'boost=' + encodeURIComponent(functions);
   this.parameters.push(parameter);
   return self;
}

/**
 * Build a querystring with the array of `this.parameters`.
 *
 * @return {String}
 * @api private
 */
Query.prototype.build = function(){
   return this.parameters.join('&');
}

