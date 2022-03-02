import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#search("q=*:*")', function () {
    it('should find all documents', async function () {
      const data = await client.search('q=*:*');
      dataOk(data);
      assert.deepEqual({ q: '*:*', wt: 'json' }, data.responseHeader.params);
    });
  });
  describe('#search(query)', function () {
    it('should find documents describe in the `query` instance of `Query`', async function () {
      const query = client.query().q({
        title_t: 'test',
      });
      const data = await client.search(query);
      dataOk(data);
    });
  });
  describe('#search(fq or q) with complexPhrase', function () {
    it('should find documents described in the `q` instance of `Query` with complexPhrase and q type string', async function () {
      const docs = [
        {
          id: 1,
          region_t: 'north',
        },
        {
          id: 2,
          region_t: `"north east"`,
        },
        {
          id: 3,
          region_t: 'east',
        },
        {
          id: 4,
          region_t: `"south east"`,
        },
      ];
      await client.add(docs);
      await client.commit();

      const query = client
        .query()
        .q('region_t:east', { complexPhrase: true })
        .qop('AND');

      const data = await client.search(query);
      assert.equal(data.responseHeader.params?.q, [
        `{!complexphrase inOrder=true}region_t:east`,
      ]);

      assert.equal(data.response.numFound, 3);
    });
    it('should find documents described in the `q` instance of `Query` with complexPhrase and q type object', async function () {
      const docs = [
        {
          id: 1,
          region_t: 'north',
        },
        {
          id: 2,
          region_t: `"north east"`,
        },
        {
          id: 3,
          region_t: 'east',
        },
        {
          id: 4,
          region_t: `"south east"`,
        },
      ];
      await client.add(docs);
      await client.commit();

      const query = client
        .query()
        .q({ region_t: 'east' }, { complexPhrase: true });

      const data = await client.search(query);
      assert.equal(data.responseHeader.params?.q, [
        `{!complexphrase inOrder=true}region_t:east`,
      ]);

      assert.equal(data.response.numFound, 3);
    });
    it('should find documents described in the `fq` instance of `Query` with complexPhrase', async function () {
      const docs = [
        {
          id: 1,
          region_t: 'north',
        },
        {
          id: 2,
          region_t: `"north east"`,
        },
        {
          id: 3,
          region_t: 'east',
        },
        {
          id: 4,
          region_t: `"south east"`,
        },
      ];
      await client.add(docs);
      await client.commit();

      const query = client
        .query()
        .q({ '*': '*' })
        .qop('AND')
        .fq({
          field: 'region_t',
          value: `"north east"`,
          configOption: { complexPhrase: true },
        });

      const data = await client.search(query);
      assert.equal(
        data.responseHeader.params?.fq,
        `{!complexphrase inOrder=true}region_t:"north east"`
      );

      assert.equal(data.response.numFound, 1);
    });
    it('should find documents described by multiple criteria in the `fq` instance of `Query` with complexPhrase', async function () {
      const docs = [
        {
          id: 1,
          region_t: 'north',
          description_t: `"northmost point"`,
        },
        {
          id: 2,
          region_t: `"north east"`,
          description_t: `"northeasternmost point"`,
        },
        {
          id: 3,
          region_t: `"south east"`,
          description_t: `"easternmost point"`,
        },
        {
          id: 4,
          region_t: 'south',
          description_t: 'point',
        },
      ];
      await client.add(docs);
      await client.commit();

      const query = client
        .query()
        .q({ '*': '*' })
        .qop('AND')
        .fq([
          {
            field: 'region_t',
            value: 'south',
          },
          {
            field: 'description_t',
            value: 'point',
            configOption: { complexPhrase: true },
          },
        ]);

      const data = await client.search(query);

      assert.deepEqual(data.responseHeader.params?.fq, [
        'region_t:south',
        '{!complexphrase inOrder=true}description_t:point',
      ]);
      assert.equal(data.response.numFound, 2);
    });
  });
});
