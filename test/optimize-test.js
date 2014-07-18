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
	describe('#optimize(callback)',function(){
		it('should optimize',function(done){
			client.optimize(function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#optimize({softCommit : true},callback)',function(){
		it('should optimize with the option softCommit enabled',function(done){
			client.optimize({softCommit : true},function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#optimize({waitSearcher : true},callback)',function(){
		it('should optimize with the option waitSearcher enabled',function(done){
			client.optimize({waitSearcher : true},function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#optimize({maxSegments : 2},callback)',function(){
		it('should optimize with the option maxSegments set to 2',function(done){
			client.optimize({maxSegments : 2},function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#optimize({unknownOption : true},callback)',function(){
		it('should return a `SolrError`',function(done){
			client.optimize({unknownOption : true},function(err,data){
				sassert.nok(err,data);
				done();
			});
		});
	});
});
