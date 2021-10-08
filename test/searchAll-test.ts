import * as figc from 'figc';
import { createClient } from '../lib/solr';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#searchAll(callback)', function () {
    it('should find all documents', async function () {
      const data = await client.searchAll();
      dataOk(data);
    });
  });
});
