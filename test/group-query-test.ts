/**
 * Testing support for http://wiki.apache.org/solr/FieldCollapsing?highlight=%28field%29%7C%28collapsing%29
 */

import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery', function () {
  describe('.groupBy(field), callback)', function () {
    it('should create a group by query', async function () {
      const query = client.query().q('test').groupBy('title_t').debugQuery();
      const data = await client.search(query);
      dataOk(data);
      assert(data.responseHeader.params?.group);
      assert.equal('title_t', data.responseHeader.params?.['group.field']);
    });
  });

  describe('#group(options), callback)', function () {
    it('should create a group query', async function () {
      const options = {
        on: true,
        field: 'title_t',
        func: 'test',
        rows: 11,
        start: 1,
        limit: 15,
        offset: 8,
        sort: 'score desc',
        format: 'simple',
        main: true,
        ngroups: true,
        truncate: true,
        facet: true,
        cache: 50,
      };

      const query = client.query().group(options);

      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        'group.format': 'simple',
        'group.ngroups': 'true',
        'group.limit': '15',
        'group.truncate': 'true',
        'group.field': 'title_t',
        'group.main': 'true',
        group: 'true',
        'group.sort': 'score desc',
        'group.cache.percent': '50',
        'group.offset': '8',
        wt: 'json',
      });
    });
  });
});
