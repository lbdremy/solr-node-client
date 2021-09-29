import * as figc from 'figc';
import * as sassert from './sassert';
import * as versionUtils from '../lib/utils/version';
import { assert } from 'chai';
import { createClient } from '../lib/solr';
import { dataOk, ok } from './sassert';

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
      // const request = client.add(docs, options, function (err, data) {
      //   if (
      //     client.solrVersion &&
      //     versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
      //   ) {
      //     assert.equal(
      //       request.path,
      //       basePath + '/update?softCommit=true&wt=json'
      //     );
      //   } else {
      //     assert.equal(
      //       request.path,
      //       basePath + '/update/json?softCommit=true&wt=json'
      //     );
      //   }
      //   sassert.ok(err, data);
      //   done();
      // });
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
      // const request = client.add(docs, options, function (err, data) {
      //   if (
      //     client.solrVersion &&
      //     versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
      //   ) {
      //     assert.equal(request.path, basePath + '/update?commit=true&wt=json');
      //   } else {
      //     assert.equal(
      //       request.path,
      //       basePath + '/update/json?commit=true&wt=json'
      //     );
      //   }
      //   sassert.ok(err, data);
      //   done();
      // });
      const data = await client.add(docs, options);
      dataOk(data);
      //TODO
      //   if (
      //     client.solrVersion &&
      //     versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
      //   ) {
      //     assert.equal(request.path, basePath + '/update?commit=true&wt=json');
      //   } else {
      //     assert.equal(
      //       request.path,
      //       basePath + '/update/json?commit=true&wt=json'
      //     );
      //   }
      // });
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
      // const request = client.add(docs, options, function (err, data) {
      //   if (
      //     client.solrVersion &&
      //     versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
      //   ) {
      //     assert.equal(
      //       request.path,
      //       basePath + '/update?commitWithin=10000&wt=json'
      //     );
      //   } else {
      //     assert.equal(
      //       request.path,
      //       basePath + '/update/json?commitWithin=10000&wt=json'
      //     );
      //   }
      //   sassert.ok(err, data);
      //   done();
      // });
      const data = await client.add(docs, options);
      dataOk(data);

      //TODO
    });
  });
});
