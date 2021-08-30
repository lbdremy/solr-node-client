/**
 * Modules dependencies
 */
const figc = require('figc'),
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr');
import * as sassert from './sassert';

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#rollback(callback)', function () {
    it('should rollback all changes before the last hard commit', function (done) {
      client.rollback(function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
});
