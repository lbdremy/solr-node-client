/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	sassert = require('./sassert');

// Test suite
var config = require('./config.json') || { client: {path: '/solr'}};
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/') ;

describe('Client',function(){
	describe('#rollback(callback)',function(){
		it('should rollback all changes before the last hard commit',function(done){
			client.rollback(function(err,data){
				sassert.ok(err,data);
				done();
			})
		});
	})
});
