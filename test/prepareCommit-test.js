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
	describe('#prepareCommit(callback)',function(){
		it('should prepare the commit',function(done){
			var request = client.prepareCommit(function(err,data){
				sassert.ok(err,data);
				assert.equal(request.path,'/solr/update/json?prepareCommit=true&wt=json');
				done();
			});
		});
	});
});

// Support 
// http://wiki.apache.org/solr/UpdateXmlMessages?highlight=%28softCommit%29#A.22prepareCommit.22