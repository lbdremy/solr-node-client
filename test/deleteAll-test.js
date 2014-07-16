/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	SolrError = require(libPath + '/error/solr-error'),
	sassert = require('./sassert');

// Test suite
var config = require('./config.json') || { client: {path: '/solr'}};
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/') ;

describe('Client',function(){
	describe('#deleteAll(callback)',function(){
		it('should delete all documents',function(done){
			client.deleteAll(function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
	});
});
