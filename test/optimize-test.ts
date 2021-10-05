import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './utils/sassert';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#optimize(callback)', function () {
    it('should optimize', async function () {
      const data = await client.optimize({});
      dataOk(data);
    });
  });
  describe('#optimize({softCommit : true},callback)', function () {
    it('should optimize with the option softCommit enabled', async function () {
      const data = await client.optimize({ softCommit: true });
      dataOk(data);
    });
  });
  describe('#optimize({waitSearcher : true},callback)', function () {
    it('should optimize with the option waitSearcher enabled', async function () {
      const data = await client.optimize({ waitSearcher: true });
      dataOk(data);
    });
  });
  describe('#optimize({maxSegments : 2},callback)', function () {
    it('should optimize with the option maxSegments set to 2', async function () {
      const data = await client.optimize({ maxSegments: 2 });
      dataOk(data);
    });
  });
  describe('#optimize({unknownOption : true},callback)', function () {
    it('should return a `SolrError`', async function () {
      await client.optimize({ unknownOption: true });
    });
  });
});
