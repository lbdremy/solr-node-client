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
	describe('#delete("title_t","test",callback)',function(){
		it('should delete all documents where the field "title_t" is "test"',function(done){
			client.delete('title_t','test',function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#delete("title_t","test",{ commit : true},callback)',function(){
		it('should delete all documents where the field "title_t" is "test" and hard commit all changes',function(done){
			var request = client.delete('title_t','test',{commit : true},function(err,data){
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
	describe('#delete("title_t","test",{ softCommit : true},callback)',function(){
		it('should delete all documents where the field "title_t" is "test" and soft commit all changes',function(done){
			var request = client.delete('title_t','test',{softCommit : true},function(err,data){
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
	describe('#delete("title_t","test",{ commitWithin : 10000},callback)',function(){
		it('should delete all documents where the field "title_t" is "test" and commit within 10s all changes',function(done){
			var request = client.delete('title_t','test',{commitWithin : 10000},function(err,data){
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
	describe('#delete("unknownField","test",callback)',function(){
		it('should return a `SolrError`',function(done){
			client.delete('unknownField','test',function(err,data){
				sassert.nok(err,data);;
				done();
			});
		});
	});
});
