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
	describe('#ping(callback)',function(){
		it('should ping',function(done){
			client.ping(function(err,data){
				//ping is introducing omitting headers since ping-headers from solr contains duplicate key violation according to json-big
				//thus avoiding the sassert scheme which requires the headers to work
				//sassert.ok(err,data);
				assert.isNull(err);
				assert.ok(data);
				assert.equal(data.status, 'OK');
				done();
			})
		});
	})
});
