/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	SolrError = require(libPath + '/error/solr-error'),
	sassert = require('./sassert'),
	Stream = require('stream');

// Test suite
var client = solr.createClient();

describe('Client',function(){
	describe('#createAddStream()',function(){
		it('should return a `Stream`',function(){
			var addStream = client.createAddStream();
			assert.instanceOf(addStream,Stream);
		});
		describe('#write() to the `Stream` returned',function(){
			it('should add documents',function(done){
				var client = solr.createClient();
				var addStream = client.createAddStream();
				var data = '';
				addStream
					.on('end',function(){
						sassert.ok(null,JSON.parse(data));
						done();
					})
					.on('data',function(buffer,encoding){
						data += buffer.toString(encoding);
					})
					.on('error',function(err){
						sassert.ok(err);
						done();
					});
				var n = 50;
				for(var i = 0; i < n; i++){
					addStream.write({ id : i , title_t : 'title' + i, test_b : true});
				}
				addStream.end();
			})
		});
	});
});