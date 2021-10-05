import * as figc from 'figc';
import * as sassert from './utils/sassert';
import { createClient } from '../lib/solr';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#commit(callback)', function () {
    it('should commit', async function () {
      await client.commit({});
    });
  });
  describe('#commit({softCommit : true},callback)', function () {
    it('should commit with the softCommit option enabled', async function () {
      await client.commit({ softCommit: true });
    });
  });
  describe('#commit({waitSearcher : true},callback)', function () {
    it('should commit with the waitSearcher option enabled', async function () {
      await client.commit({ waitSearcher: true });
    });
  });
  //TODO
  // describe('#commit({unknownOption : true},callback)', function () {
  //   it('should return a `SolrError`', async function () {
  //     await client.commit({ unknownOption: true });
  //   });
  // });
});
