//Testing support http://wiki.apache.org/solr/FieldCollapsing?highlight=%28field%29%7C%28collapsing%29
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
  describe('.rangeFilter(array)', function () {
    it('should filter a query using an array of multiple fields', function (done) {
      const query = client
        .createQuery()
        .q('test')
        .rangeFilter([
          { field: 'id', start: 100, end: 200 },
          { field: 'id', start: 300, end: 400 },
        ])
        .debugQuery();
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal(
          '(id:[100 TO 200] AND id:[300 TO 400])',
          data.responseHeader.params.fq
        );
        done();
      });
    });
  });

  describe('.rangeFilter(start, end)', function () {
    it('should filter a query using a range', function (done) {
      const query = client
        .createQuery()
        .q('test')
        .rangeFilter({ field: 'id', start: 100, end: 200 });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[100 TO 200]', data.responseHeader.params.fq);
        done();
      });
    });
    it('should filter a query using a range when start and end values are not set', function (done) {
      const query = client
        .createQuery()
        .q('test')
        .rangeFilter({ field: 'id'});

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[* TO *]', data.responseHeader.params.fq);
        done();
      });
    });
    it('should filter a query using a range when start value is not set', function (done) {
      const query = client
        .createQuery()
        .q('test')
        .rangeFilter({ field: 'id', end: 200});

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[* TO 200]', data.responseHeader.params.fq);
        done();
      });
    });
    it('should filter a query using a range when end value is not set', function (done) {
      const query = client
        .createQuery()
        .q('test')
        .rangeFilter({ field: 'id', start: 200});

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[200 TO *]', data.responseHeader.params.fq);
        done();
      });
    });
  });
});
