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
var client = solr.createClient();

describe('Client',function(){
	describe('#softCommit(callback)',function(){
		it('should do a soft commit',function(done){
			var request = client.softCommit(function(err,data){
				sassert.ok(err,data);
				assert.equal(request.path,'/solr/update/json?softCommit=true&wt=json');
				done();
			});
		});
	});
});

// Support 
// http://wiki.apache.org/solr/UpdateXmlMessages?highlight=%28softCommit%29#A.22prepareCommit.22