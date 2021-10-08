/**
 * Testing support for http://wiki.apache.org/solr/CommonQueryParameters
 */

import * as figc from 'figc';
import { assert } from 'chai';
import { createClient } from '../lib/solr';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery', function () {
  before(async () => {
    await client.createSchemaField('title', 'text_general');
    await client.createSchemaField('name', 'text_general');
    await client.createSchemaField('author', 'text_general');
  });

  describe('query() with various query options', function () {
    it('basic query with multiple fields', async function () {
      const query = client
        .query()
        .q({ title: 'name', author: 'me' })
        .debugQuery();

      const response = await client.search(query);
      dataOk(response);
      assert.deepEqual(response.responseHeader.params, {
        debugQuery: 'true',
        q: 'title:name AND author:me',
        wt: 'json',
      });
    });

    it('query sorted', async function () {
      const query = client
        .query()
        .q('*:*')
        .sort({ author: 'asc' })
        .debugQuery(); // remove ', "category":"desc"' as newer solr doesn't support

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        sort: 'author asc',
        wt: 'json',
      });
    });

    it('query with paging', async function () {
      const query = client.query().q('*:*').start(21).rows(20).debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        start: '21',
        rows: '20',
        wt: 'json',
      });
    });

    it('query paged with cursorMark', async function () {
      const query = client
        .query()
        .q('*:*')
        .start(0)
        .sort({ id: 'asc' })
        .cursorMark()
        .debugQuery();

      const response = await client.search(query);
      dataOk(response);
      assert.deepEqual(response.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        start: '0',
        sort: 'id asc',
        cursorMark: '*',
        wt: 'json',
      });
    });

    it('custom parameter setting - allows for any Filterquery(fq)', async function () {
      const query = client.query().q('*:*').set('fq=sqrt(id)').debugQuery();

      const response = await client.search(query);
      dataOk(response);
      assert.deepEqual(response.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        fq: 'sqrt(id)',
        wt: 'json',
      });
    });

    it('listing fields with fl', async function () {
      const query = client
        .query()
        .q('*:*')
        .fl(['id', 'title*', 'score'])
        .debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        fl: 'id,title*,score',
        wt: 'json',
      });
    });

    it('escapes fl parameter', async function () {
      // if it's not escaped correctly, SOLR returns HTTP 400
      const query = client
        .query()
        .q('*:*')
        .fl(['id', 'score', "found_words:exists(query({!v='name:word'}))"]);
      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        q: '*:*',
        fl: "id,score,found_words:exists(query({!v='name:word'}))",
        wt: 'json',
      });
    });

    it('query with deftype', async function () {
      const query = client.query().q('*:*').defType('lucene').debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        defType: 'lucene',
        wt: 'json',
      });
    });

    it('query with time-allowed', async function () {
      const query = client.query().q('*:*').timeout(1000).debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        timeAllowed: '1000',
        wt: 'json',
      });
    });

    it('q.op - Default query-operator', async function () {
      const query = client
        .query()
        .q('author:ali remy marc')
        .qop('OR')
        .debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: 'author:ali remy marc',
        'q.op': 'OR',
        wt: 'json',
      });
    });

    it('df - Default field query', async function () {
      const query = client.query().q('ali').df('author').debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: 'ali',
        df: 'author',
        wt: 'json',
      });
    });

    it('query with range-filter', async function () {
      const query = client
        .query()
        .q('*:*')
        .rangeFilter({ field: 'id', start: 100, end: 200 })
        .debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        fq: 'id:[100 TO 200]',
        wt: 'json',
      });
    });

    it('query with match-filter', async function () {
      const query = client
        .query()
        .q('*:*')
        .matchFilter('id', '19700506.173.85')
        .debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        fq: 'id:19700506.173.85',
        wt: 'json',
      });
    });

    it('query with multiple match-filters', async function () {
      const query = client
        .query()
        .q('*:*')
        .fq([
          { field: 'id', value: '19700506.173.85' },
          { field: 'title', value: 'testvalue' },
        ])
        .debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        fq: ['id:19700506.173.85', 'title:testvalue'],
        wt: 'json',
      });
    });

    it('query with object match-filter', async function () {
      const query = client
        .query()
        .q('*:*')
        .fq({ field: 'id', value: '19700506.173.85' })
        .debugQuery();

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        q: '*:*',
        fq: 'id:19700506.173.85',
        wt: 'json',
      });
    });
  });
});
