/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	SolrError = require(libPath + '/error/solr-error'),
	sassert = require('./sassert');

//TODO support all stuff describe there
// http://wiki.apache.org/solr/SimpleFacetParameters#Retrieve_docs_with_facets_missing
// and http://wiki.apache.org/solr/HierarchicalFaceting

// Test suite
var client = solr.createClient();

describe('Client#createQuery()',function(){
	describe('.facet(options)',function(){
		it('should create a facet for multiple date/range fields',function(done){
			var date = new Date().getTime();
			var facetOptions = {
									"on": true
								,	"query": "query"
								,	"field": "field"
								,	"prefix": "prefix"
								,	"sort": "field desc"
								,	"limit": 100
								,	"offset": 5
								,	"mincount": 10
								,	"missing": true
								,	"method": "fc"
								,	"date": [{
											"field": "date_field"
										,	"start": date
										,	"end": date
										,	"gap": "+1DAY"
										,	"hardened": true
										,	"other": "all"
										,	"include": "all"
										}]
								,	"range": [{
											"field": "range_field"
										,	"start": 0.0
										,	"end": "1000"	
										,	"gap": "+1DAY"
										,	"hardened": true
										,	"other": "all"
										,	"include": "all"
										}]
								,	"pivot": {
											"fields": ["cat", "popularity"]
										,	"mincount": 10	
										}
								}
			var query = client.createQuery()
				.facet(facetOptions)
				.q({ title_t : 'test'})
				.debugQuery();
			client.search(query,function(err,data){
				sassert.ok(err,data);
				assert.deepEqual(data.responseHeader.params,
					{
						facet: 'true',
						wt: 'json',
						debugQuery: 'true',
						q: 'title_t:test',
						'facet.field': 'field' 
						/* Other response params here */
					}
        		);
				assert.equal(data.debug.QParser,'LuceneQParser');
				done();
			});
		});

		it('should create a facet for single date/range fields',function(done){
			var date = new Date().getTime();
			var facetOptions = {
									"on": true
								,	"query": "query"
								,	"field": "field"
								,	"prefix": "prefix"
								,	"sort": "field desc"
								,	"limit": 100
								,	"offset": 5
								,	"mincount": 10
								,	"missing": true
								,	"method": "fc"
								,	"date": {
											"field": "date_field"
										,	"start": date
										,	"end": date
										,	"gap": "+1DAY"
										,	"hardened": true
										,	"other": "all"
										,	"include": "all"
										}
								,	"range": {
											"field": "range_field"
										,	"start": 0.0
										,	"end": "1000"	
										,	"gap": "+1DAY"
										,	"hardened": true
										,	"other": "all"
										,	"include": "all"
										}
								,	"pivot": {
											"fields": "cat"
										,	"mincount": 10	
										}
								}
			var query = client.createQuery()
				.facet(facetOptions)
				.q({ title_t : 'test'})
				.debugQuery();
			client.search(query,function(err,data){
				sassert.ok(err,data);
				assert.deepEqual(data.responseHeader.params,
					{
						facet: 'true',
						wt: 'json',
						debugQuery: 'true',
						q: 'title_t:test',
						'facet.field': 'field' 
						/* Other response params here */
					}
        		);
				assert.equal(data.debug.QParser,'LuceneQParser');
				done();
			});
		});
	});
});