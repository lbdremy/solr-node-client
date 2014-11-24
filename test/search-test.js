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

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");

describe('Client',function(){
	describe('#search("q=*:*")',function(){
		it('should find all documents using GET',function(done){
			client.search('q=*:*',function(err,data){
				sassert.ok(err,data);
				assert.deepEqual({ q : '*:*' , wt: 'json' },data.responseHeader.params);
				done();
			});
		});
	});
	describe('#search(query)',function(){
		it('should find documents using GET described in the `query` instance of `Query`',function(done){
			var query = client.createQuery()
				.q({
					'title_t' : 'test'
				});
			client.search(query,function(err,data){
				sassert.ok(err,data);
				assert.deepEqual({ q : 'title_t:test', wt: 'json' },data.responseHeader.params);
				done();
			});
		});
	});
	describe('#search("q=*:*")',function(){
		it('should find all documents using POST',function(done){
			client.options.searchMethod = 'POST'
			client.search('q=*:*',function(err,data){
				sassert.ok(err,data);
				assert.deepEqual({ q : '*:*' , wt: 'json' },data.responseHeader.params);
				done();
			});
		});
	});
	describe('#search(query)',function(){
		it('should find documents using POST, described in the `query` instance of `Query`',function(done){
			client.options.searchMethod = 'POST'
			var query = client.createQuery()
				.q({
					'title_t' : 'test'
				});
			client.search(query,function(err,data){
				sassert.ok(err,data);
				assert.deepEqual({ q : 'title_t:test', wt: 'json' },data.responseHeader.params);
				done();
			});
		});
	});
});
