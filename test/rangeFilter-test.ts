/*
 * Testing support for http://wiki.apache.org/solr/FieldCollapsing?highlight=%28field%29%7C%28collapsing%29
 */

import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery', function () {
  describe('.rangeFilter(array)', function () {
    it('should filter a query using an array of multiple fields', function (done) {
      const query = client
        .query()
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
        .query()
        .q('test')
        .rangeFilter({ field: 'id', start: 100, end: 200 });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[100 TO 200]', data.responseHeader.params.fq);
        done();
      });
    });
    it('should filter a query using a range when start and end values are not set', function (done) {
      const query = client.query().q('test').rangeFilter({ field: 'id' });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[* TO *]', data.responseHeader.params.fq);
        done();
      });
    });
    it('should filter a query using a range when start value is not set', function (done) {
      const query = client
        .query()
        .q('test')
        .rangeFilter({ field: 'id', end: 200 });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[* TO 200]', data.responseHeader.params.fq);
        done();
      });
    });
    it('should filter a query using a range when end value is not set', function (done) {
      const query = client
        .query()
        .q('test')
        .rangeFilter({ field: 'id', start: 200 });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal('id:[200 TO *]', data.responseHeader.params.fq);
        done();
      });
    });
    it('should filter a query using a range join', function (done) {
      const query = client.query().q('test').joinFilter({
        fromIndex: 'organizations',
        from: 'organizationId_i',
        to: 'id',
        field: 'name',
        value: 'test',
      });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal(
          data.responseHeader.params.fq,
          `"{!join fromIndex=organizations from=organizationId_i to=id v='name:test'}"`
        );
        done();
      });
    });
  });
});
