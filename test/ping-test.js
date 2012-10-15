/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	sassert = require('./sassert');

// Test suite
var client = solr.createClient();

describe('Client',function(){
	describe('#ping(callback)',function(){
		it('should ping',function(done){
			client.ping(function(err,data){
				sassert.ok(err,data);
				done();
			})
		});
	})
});