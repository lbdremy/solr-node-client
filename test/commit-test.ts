/**
 * Modules dependencies
 */
const figc = require('figc'),
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr')
  import * as sassert from './sassert';

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#commit(callback)', function () {
    it('should commit', function (done) {
      client.commit(function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
  describe('#commit({softCommit : true},callback)', function () {
    it('should commit with the softCommit option enabled', function (done) {
      client.commit({ softCommit: true }, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
  describe('#commit({waitSearcher : true},callback)', function () {
    it('should commit with the waitSearcher option enabled', function (done) {
      client.commit({ waitSearcher: true }, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
  describe('#commit({unknownOption : true},callback)', function () {
    it('should return a `SolrError`', function (done) {
      client.commit({ unknownOption: true }, function (err, data) {
        sassert.nok(err);
        done();
      });
    });
  });
});
