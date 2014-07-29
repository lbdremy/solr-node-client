/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	figc = require('figc'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	sassert = require('./sassert');

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");

describe('Client',function(){
	describe('#get("admin/ping",callback)',function(){
		it('should ping',function(done){
			client.get('admin/ping',function(err,data){
				sassert.ok(err,data);
				assert.equal(data.status, 'OK');
				done();
			})
		});
	})
	describe('#get("update/json", "softCommit=true", callback)',function(){
		it('should soft commit',function(done){
			var request = client.get("update/json", "softCommit=true",function(err,data){
				sassert.ok(err,data);
				assert.equal(request.path, basePath + '/update/json?softCommit=true&wt=json');
				done();
			});
		});
	});
	describe('#get("select", query, callback)',function(){
		it('should find documents describe in the `query` instance of `Query`',function(done){
			var query = client.createQuery()
				.q({
					'title_t' : 'test'
				});
			client.get('select',query,function(err,data){
				assert.deepEqual({ q : 'title_t:test', wt: 'json' },data.responseHeader.params);
				done();
			});
		});
	});
});
