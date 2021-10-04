/*
 * Testing support for http://wiki.apache.org/solr/FieldCollapsing?highlight=%28field%29%7C%28collapsing%29
 */

import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';
import { dataOk } from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('rangeFilter', () => {
  describe('Client#query', function () {
    describe('.rangeFilter(array)', function () {
      it('should filter a query using an array of multiple fields', async () => {
        const query = client
          .query()
          .q('test')
          .rangeFilter([
            { field: 'id', start: 100, end: 200 },
            { field: 'id', start: 300, end: 400 },
          ])
          .debugQuery();
        const response = await client.search(query);
        assert.equal(
          response.responseHeader.params.fq,
          '(id:[100 TO 200] AND id:[300 TO 400])'
        );
      });
    });
  });

  describe('.rangeFilter(start, end)', function () {
    it('should filter a query using a range', async () => {
      const query = client
        .query()
        .q('test')
        .rangeFilter({ field: 'id', start: 100, end: 200 });

      const response = await client.search(query);
      assert.equal('id:[100 TO 200]', response.responseHeader.params.fq);
    });

    it('should filter a query using a range when start and end values are not set', async () => {
      const query = client.query().q('test').rangeFilter({ field: 'id' });

      const response = await client.search(query);
      assert.equal('id:[* TO *]', response.responseHeader.params.fq);
    });

    it('should filter a query using a range when start value is not set', async () => {
      const query = client
        .query()
        .q('test')
        .rangeFilter({ field: 'id', end: 200 });

      const response = await client.search(query);
      assert.equal('id:[* TO 200]', response.responseHeader.params.fq);
    });

    it('should filter a query using a range when end value is not set', async () => {
      const query = client
        .query()
        .q('test')
        .rangeFilter({ field: 'id', start: 200 });

      const response = await client.search(query);
      assert.equal('id:[200 TO *]', response.responseHeader.params.fq);
    });
  });
});
