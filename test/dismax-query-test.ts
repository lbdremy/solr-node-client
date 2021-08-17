/**
 * Modules dependencies
 */
const figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr')
  import * as sassert from './sassert';

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery()', function () {
  describe('.dismax().q("test")', function () {
    it('should create a dismax query', function (done) {
      const query = client.createQuery().dismax().q('test').debugQuery();
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          wt: 'json',
          q: 'test',
          defType: 'dismax',
        });
        assert.equal(data.debug.QParser, 'DisMaxQParser');
        done();
      });
    });
  });
});
