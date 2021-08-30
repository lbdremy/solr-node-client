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
  describe('#search("q=*:*")', function () {
    it('should find all documents', function (done) {
      client.search('q=*:*', function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual({ q: '*:*', wt: 'json' }, data.responseHeader.params);
        done();
      });
    });
  });
  describe('#search(query)', function () {
    it('should find documents describe in the `query` instance of `Query`', function (done) {
      const query = client.createQuery().q({
        title_t: 'test',
      });
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(
          { q: 'title_t:test', wt: 'json' },
          data.responseHeader.params
        );
        done();
      });
    });
  });
});
