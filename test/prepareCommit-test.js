/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	figc = require('figc'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	SolrError = require(libPath + '/error/solr-error'),
	sassert = require('./sassert'),
	versionUtils = require('./../lib/utils/version');

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");

describe('Client',function(){
	describe('#prepareCommit(callback)',function(){
		it('should prepare the commit',function(done){
			var request = client.prepareCommit(function(err,data){
				sassert.ok(err,data);
				if(client.options.solrVersion && versionUtils.version(client.options.solrVersion) >= versionUtils.Solr4_0) {
					assert.equal(request.path, basePath + '/update?prepareCommit=true&wt=json');
				} else {
					assert.equal(request.path, basePath + '/update/json?prepareCommit=true&wt=json');
				}
				done();
			});
		});
	});
});

// Support
// http://wiki.apache.org/solr/UpdateXmlMessages?highlight=%28softCommit%29#A.22prepareCommit.22
