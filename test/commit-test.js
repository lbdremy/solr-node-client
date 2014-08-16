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
	describe('#commit(callback)',function(){
		it('should commit',function(done){
			client.commit(function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#commit({softCommit : true},callback)',function(){
		it('should commit with the softCommit option enabled',function(done){
			client.commit({softCommit : true},function(err,data){
				sassert.ok(err,data);;
				done();
			});
		});
	});
	describe('#commit({waitSearcher : true},callback)',function(){
		it('should commit with the waitSearcher option enabled',function(done){
			client.commit({waitSearcher : true},function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#commit({unknownOption : true},callback)',function(){
		it('should return a `SolrError`',function(done){
			client.commit({unknownOption : true},function(err,data){
				sassert.nok(err,data);
				done();
			});
		});
	});
});
