/**
 * Modules dependencies
 */
const figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr'),
  sassert = require('./sassert'),
  versionUtils = require('./../lib/utils/version');

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#deleteByRange(field,start,stop,callback)', function () {
    it('should delete all documents between `start` and `stop` on the field `fied`', function (done) {
      const field = 'last_update_dt';
      const start = new Date();
      const stop = new Date();
      stop.setDate(stop.getDate() - 1);
      client.deleteByRange(field, start, stop, {}, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
  describe('#deleteByRange(field,start,stop,{softCommit : true },callback)', function () {
    it('should delete all documents between `start` and `stop` on the field `fied` with the soft commit option enabled', function (done) {
      const field = 'last_update_dt';
      const start = new Date();
      const stop = new Date();
      stop.setDate(stop.getDate() - 1);
      const request = client.deleteByRange(
        field,
        start,
        stop,
        { softCommit: true },
        function (err, data) {
          if (
            client.options.solrVersion &&
            versionUtils.version(client.options.solrVersion) >=
              versionUtils.Solr4_0
          ) {
            assert.equal(
              request.path,
              basePath + '/update?softCommit=true&wt=json'
            );
          } else {
            assert.equal(
              request.path,
              basePath + '/update/json?softCommit=true&wt=json'
            );
          }
          sassert.ok(err, data);
          done();
        }
      );
    });
  });
  describe('#deleteByRange(field,start,stop,{commitWithin : 10000},callback)', function () {
    it('should delete all documents between `start` and `stop` on the field `fied` and commit changes within 10s', function (done) {
      const field = 'last_update_dt';
      const start = new Date();
      const stop = new Date();
      stop.setDate(stop.getDate() - 1);
      const request = client.deleteByRange(
        field,
        start,
        stop,
        { commitWithin: 10000 },
        function (err, data) {
          if (
            client.options.solrVersion &&
            versionUtils.version(client.options.solrVersion) >=
              versionUtils.Solr4_0
          ) {
            assert.equal(
              request.path,
              basePath + '/update?commitWithin=10000&wt=json'
            );
          } else {
            assert.equal(
              request.path,
              basePath + '/update/json?commitWithin=10000&wt=json'
            );
          }
          sassert.ok(err, data);
          done();
        }
      );
    });
  });
  describe('#deleteByRange(field,start,stop,{commit : true},callback)', function () {
    it('should delete all documents between `start` and `stop` on the field `fied` and hard commit changes', function (done) {
      const field = 'last_update_dt';
      const start = new Date();
      const stop = new Date();
      stop.setDate(stop.getDate() - 1);
      const request = client.deleteByRange(
        field,
        start,
        stop,
        { commit: true },
        function (err, data) {
          if (
            client.options.solrVersion &&
            versionUtils.version(client.options.solrVersion) >=
              versionUtils.Solr4_0
          ) {
            assert.equal(
              request.path,
              basePath + '/update?commit=true&wt=json'
            );
          } else {
            assert.equal(
              request.path,
              basePath + '/update/json?commit=true&wt=json'
            );
          }
          sassert.ok(err, data);
          done();
        }
      );
    });
  });
});
