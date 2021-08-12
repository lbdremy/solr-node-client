// Testing support http://wiki.apache.org/solr/TermsComponent
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

describe('Client#createQuery', function () {
  describe('#terms(options), callback)', function () {
    it('should create a Terms query and termsSearch', function (done) {
      const options = {
        on: true,
        fl: 'title',
        prefix: 's',
        mincount: 1,
        maxcount: 10,
        limit: 5,
        sort: 'index',
      };

      const query = client.createQuery().terms(options).debugQuery();

      client.termsSearch(query, function (err, data) {
        sassert.ok(err, data);
        assert.isObject(data.terms);
        done();
      });
    });
  });
});
