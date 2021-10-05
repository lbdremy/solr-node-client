import * as figc from 'figc';
import { createClient } from '../lib/solr';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#spell', function () {
    it('should test the "/spell" query handler/ spellchecker', async function () {
      const query = client.query().q('test');
      const data = await client.spell(query);
      dataOk(data);
    });
  });
});
