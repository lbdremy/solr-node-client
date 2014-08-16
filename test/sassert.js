/**
 * Modules dependencies
 */

var assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	SolrError = require(libPath + '/error/solr-error');

// Macros to assert Solr response

exports.ok = function(err,data){
	assert.isNull(err);
	assert.isObject(data);
	assert.equal(data.responseHeader.status,0);
}

exports.nok = function(err,data){
	assert.instanceOf(err,SolrError);
}
