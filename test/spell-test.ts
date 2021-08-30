/**
 * Modules dependencies
 */
const figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr');
import * as sassert from './sassert';

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#spell', function () {
    it('should test the "/spell" query handler/ spellchecker', function (done) {
      const query = client.query().q('test');
      client.spell(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal(0, data.responseHeader.status);
        done();
      });
    });
  });
});
