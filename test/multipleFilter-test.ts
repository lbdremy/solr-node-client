import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery', function () {
  describe('.multipleFilter', function () {
    it('should filter a query using multiple values for one index', async function () {
      const docs = [
        {
          id: 1,
          region_s: 'east',
          sales_i: 100000,
        },
        {
          id: 2,
          region_s: 'west',
          sales_i: 200000,
        },
        {
          id: 3,
          region_s: 'north',
          sales_i: 300000,
        },
        {
          id: 4,
          region_s: 'south',
          sales_i: 400000,
        },
      ];
      await client.add(docs);
      await client.commit();

      const query = client
        .query()
        .q({ '*': '*' })
        .qop('AND')
        .multipleFilter('region_s', ['east', 'west', 'south']);

      const data = await client.search(query);
      assert.equal(
        data.responseHeader.params?.fq,
        `region_s:(east west south)`
      );

      assert.equal(data.response.numFound, 3);
    });
  });
});
