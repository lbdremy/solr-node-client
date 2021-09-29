import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#rollback(callback)', function () {
    it('should rollback all changes before the last hard commit', async function () {
      await client.rollback();
    });
  });
});
