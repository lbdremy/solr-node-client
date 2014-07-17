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
	describe('#deleteByRange(field,start,stop,callback)',function(){
		it('should delete all documents between `start` and `stop` on the field `fied`',function(done){
			var field = 'last_update_dt';
			var start = new Date();
			var stop = new Date();
			stop.setDate(stop.getDate() - 1);
			client.deleteByRange(field,start,stop,function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#deleteByRange(field,start,stop,{softCommit : true },callback)',function(){
		it('should delete all documents between `start` and `stop` on the field `fied` with the soft commit option enabled',function(done){
			var field = 'last_update_dt';
			var start = new Date();
			var stop = new Date();
			stop.setDate(stop.getDate() - 1);
			var request =  client.deleteByRange(field,start,stop,{softCommit : true},function(err,data){
				assert.equal(request.path, basePath + '/update/json?softCommit=true&wt=json');
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#deleteByRange(field,start,stop,{commitWithin : 10000},callback)',function(){
		it('should delete all documents between `start` and `stop` on the field `fied` and commit changes within 10s',function(done){
			var field = 'last_update_dt';
			var start = new Date();
			var stop = new Date();
			stop.setDate(stop.getDate() - 1);
			var request = client.deleteByRange(field,start,stop,{commitWithin : 10000},function(err,data){
				assert.equal(request.path, basePath + '/update/json?commitWithin=10000&wt=json');
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#deleteByRange(field,start,stop,{commit : true},callback)',function(){
		it('should delete all documents between `start` and `stop` on the field `fied` and hard commit changes',function(done){
			var field = 'last_update_dt';
			var start = new Date();
			var stop = new Date();
			stop.setDate(stop.getDate() - 1);
			var request = client.deleteByRange(field,start,stop,{commit : true},function(err,data){
				assert.equal(request.path, basePath + '/update/json?commit=true&wt=json');
				sassert.ok(err,data);
				done();
			});
		});
	});
});
