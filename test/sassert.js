/**
 * Modules dependencies
 */

const assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  SolrError = require(libPath + '/error/solr-error');

// Macros to assert Solr response

exports.ok = function (err, data) {
  assert.isNull(err, `Response was not ok: ${err && err.message}`);
  assert.isObject(data);
  assert.equal(data.responseHeader.status, 0);
};

exports.nok = function (err) {
  assert.instanceOf(err, SolrError);
};
