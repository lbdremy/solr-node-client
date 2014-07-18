/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	figc = require('figc'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	SolrError = require(libPath + '/error/solr-error'),
	sassert = require('./sassert');

//TODO support all stuff describe there
// http://wiki.apache.org/solr/SimpleFacetParameters#Retrieve_docs_with_facets_missing
// and http://wiki.apache.org/solr/HierarchicalFaceting

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");

describe('Client#createQuery()',function(){
	describe('.facet({field : "category_t"}).q({title_t : "test"})',function(){
		it('should create a facet on the field "category_t"',function(done){
			var query = client.createQuery()
				.facet({
					field : 'category_t'
				})
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
						'facet.field': 'category_t' 
					}
        		);
				assert.equal(data.debug.QParser,'LuceneQParser');
				done();
			});
		});
	});
});
