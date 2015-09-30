/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	figc = require('figc'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	sassert = require('./sassert'),
	versionUtils = require('./../lib/utils/version');

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");

describe('Client',function(){
	describe('#add({ id : 1, title_t : "title"},callback)',function(){
		it('should add one document',function(done){
			var doc = {
				id : 1,
				title_t : 'title1'
			};
			client.add(doc,function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#add([{},{},...],callback)',function(){
		it('should add all documents in the array',function(done){
			var docs = [
				{
					id : 2,
					title_t : 'title2'
				},
				{
					id : 3,
					title_t : 'title3'
				}
			];
			client.add(docs,function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
	describe('#add(docs,{ softCommit : true},callback)',function(){
		it('should add all documents with the softCommit option enabled',function(done){
			var docs = [
				{
					id : 4,
					title_t : 'title4'
				},
				{
					id : 5,
					title_t : 'title5'
				}
			];
			var options = {
				softCommit : true
			};
			var request = client.add(docs,options,function(err,data){
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
	describe('#add(docs,{ commit : true},callback)',function(){
		it('should add all documents with the commit option enabled',function(done){
			var docs = [
				{
					id : 6,
					title_t : 'title6'
				},
				{
					id : 7,
					title_t : 'title7'
				}
			];
			var options = {
				commit : true
			};
			var request = client.add(docs,options,function(err,data){
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
	describe('#add(docs,{ commitWithin : 10000},callback)',function(){
		it('should add all documents with the commitWithin option set to 10s',function(done){
			var docs = [
				{
					id : 8,
					title_t : 'title8'
				},
				{
					id : 9,
					title_t : 'title9'
				}
			];
			var options = {
				commitWithin : 10000
			};
			var request = client.add(docs,options,function(err,data){
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
});
