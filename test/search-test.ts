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
});
