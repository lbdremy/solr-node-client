import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#doQuery("admin/ping",callback)', async function () {
    it('should ping', async function () {
      const data = await client.doQuery<Record<any, any>>('admin/ping', '');
      dataOk(data);
      assert.equal(data.status, 'OK');
    });
  });

  describe('#doQuery("update/json", "softCommit=true", callback)', function () {
    it('should soft commit', async function () {
      const response = await client.doQuery<Record<any, any>>(
        'update/json',
        'softCommit=true'
      );
      dataOk(response);
    });
  });

  describe('#doQuery("select", query, callback)', function () {
    it('should find documents describe in the `query` instance of `Query`', async function () {
      const query = client.query().q({
        title_t: 'test',
      });
      const response = await client.doQuery<Record<string, any>>(
        'select',
        query
      );
      assert.deepEqual(
        { q: 'title_t:test', wt: 'json' },
        response.responseHeader.params
      );
    });
  });
});
