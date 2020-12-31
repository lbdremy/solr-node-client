/**
 * Modules dependencies
 */
const figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr'),
  sassert = require('./sassert');

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#searchAll(callback)', function () {
    it('should find all documents', function (done) {
      client.searchAll(function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual({ q: '*', wt: 'json' }, data.responseHeader.params);
        done();
      });
    });
  });
});
