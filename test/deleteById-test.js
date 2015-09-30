/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	figc = require('figc'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	SolrError = require(libPath + '/error/solr-error'),
	sassert = require('./sassert'),
	versionUtils = require('./../lib/utils/version');

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");

describe('Client',function(){
	describe('#deleteByID(1,callback)',function(){
		it('should delete the document with the id 1',function(done){
			client.deleteByID(1,function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#deleteByID(1,{softCommit : true },callback)',function(){
		it('should delete the document with the id 1 and the soft commit option enabled',function(done){
			var request =  client.deleteByID(1,{softCommit : true},function(err,data){
				if(client.options.solrVersion && versionUtils.version(client.options.solrVersion) >= versionUtils.Solr4_0) {
					assert.equal(request.path, basePath + '/update?softCommit=true&wt=json');
				} else {
					assert.equal(request.path, basePath + '/update/json?softCommit=true&wt=json');
				}
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#deleteByID(1,{commitWithin : 10000},callback)',function(){
		it('should delete the document with the id 1 and commit changes within 10s',function(done){
			var request = client.deleteByID(1,{commitWithin : 10000},function(err,data){
				if(client.options.solrVersion && versionUtils.version(client.options.solrVersion) >= versionUtils.Solr4_0) {
					assert.equal(request.path, basePath + '/update?commitWithin=10000&wt=json');
				} else {
					assert.equal(request.path, basePath + '/update/json?commitWithin=10000&wt=json');
				}
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#deleteByID(1,{commit : true},callback)',function(){
		it('should delete the document with the id 1 and hard commit changes',function(done){
			var request = client.deleteByID(1,{commit : true},function(err,data){
				if(client.options.solrVersion && versionUtils.version(client.options.solrVersion) >= versionUtils.Solr4_0) {
					assert.equal(request.path, basePath + '/update?commit=true&wt=json');
				} else {
					assert.equal(request.path, basePath + '/update/json?commit=true&wt=json');
				}
				sassert.ok(err,data);
				done();
			});
		});
	});
});
