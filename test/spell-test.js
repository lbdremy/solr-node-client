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
	describe('#spell',function(){
		it('should test the "/spell" query handler/ spellchecker',function(done){
			var query = client.createQuery()
                                  .q('test');
			client.spell(query,function(err,data){
				sassert.ok(err,data);
				assert.equal(0, data.responseHeader.status);
				done();
			});
		});
	});
});
