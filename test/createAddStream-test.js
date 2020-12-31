require(libPath + '/error/solr-error');
require('mocha');
/**
 * Modules dependencies
 */
const figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr'),
  sassert = require('./sassert'),
  Stream = require('stream');

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#createAddStream()', function () {
    it('should return a `Stream`', function () {
      const addStream = client.createAddStream();
      assert.instanceOf(addStream, Stream);
    });
    describe('#write() to the `Stream` returned', function () {
      it('should add documents', function (done) {
        const addStream = client.createAddStream();
        let data = '';
        addStream
          .on('end', function () {
            sassert.ok(null, JSON.parse(data));
            done();
          })
          .on('data', function (buffer, encoding) {
            data += buffer.toString(encoding);
          })
          .on('error', function (err) {
            sassert.ok(err);
            done();
          });
        const n = 50;
        for (let i = 0; i < n; i++) {
          addStream.write({ id: i, title_t: 'title' + i, test_b: true });
        }
        addStream.end();
      });
    });
  });
});
