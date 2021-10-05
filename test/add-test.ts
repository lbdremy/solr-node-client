import * as figc from 'figc';
import { createClient } from '../lib/solr';
import { dataOk, ok } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#add({ id : 1, title_t : "title"},callback)', function () {
    it('should add one document', async function () {
      const doc = {
        id: 1,
        title_t: 'title1',
      };

      const data = await client.add(doc);
      dataOk(data);
    });
  });

  describe('#add([{},{},...],callback)', function () {
    it('should add all documents in the array', async function () {
      const docs = [
        {
          id: 2,
          title_t: 'title2',
        },
        {
          id: 3,
          title_t: 'title3',
        },
      ];
      const data = await client.add(docs);
      dataOk(data);
    });
  });

  describe('#add(docs,{ softCommit : true},callback)', function () {
    it('should add all documents with the softCommit option enabled', async function () {
      const docs = [
        {
          id: 4,
          title_t: 'title4',
        },
        {
          id: 5,
          title_t: 'title5',
        },
      ];
      const options = {
        softCommit: true,
      };
      const data = await client.add(docs, options);
      dataOk(data);
    });
  });

  describe('#add(docs,{ commit : true},callback)', function () {
    it('should add all documents with the commit option enabled', async function () {
      const docs = [
        {
          id: 6,
          title_t: 'title6',
        },
        {
          id: 7,
          title_t: 'title7',
        },
      ];
      const options = {
        commit: true,
      };

      const data = await client.add(docs, options);
      dataOk(data);
    });
  });

  describe('#add(docs,{ commitWithin : 10000},callback)', function () {
    it('should add all documents with the commitWithin option set to 10s', async function () {
      const docs = [
        {
          id: 8,
          title_t: 'title8',
        },
        {
          id: 9,
          title_t: 'title9',
        },
      ];
      const options = {
        commitWithin: 10000,
      };

      const data = await client.add(docs, options);
      dataOk(data);
    });
  });
});
