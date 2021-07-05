/**
 * Modules dependencies
 */
const figc = require('figc'),
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr'),
  sassert = require('./sassert');

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#deleteAll(callback)', function () {
    it('should delete all documents', function (done) {
      client.deleteAll({}, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
});
