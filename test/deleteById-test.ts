import { assert } from 'chai';
import * as sassert from './sassert';
import * as versionUtils from '../lib/utils/version';
import * as figc from 'figc';
import { createClient } from '../lib/solr';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#deleteByID(1,callback)', function () {
    it('should delete the document with the id 1', async function () {
      await client.deleteByID(1);
    });
  });
  //TODO
  // describe('#deleteByID(1,{softCommit : true },callback)', function () {
  //   it('should delete the document with the id 1 and the soft commit option enabled', function (done) {
  //     const request = client.deleteByID(
  //       1,
  //       { softCommit: true },
  //       function (err, data) {
  //         if (
  //           client.solrVersion &&
  //           versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
  //         ) {
  //           assert.equal(
  //             request.path,
  //             basePath + '/update?softCommit=true&wt=json'
  //           );
  //         } else {
  //           assert.equal(
  //             request.path,
  //             basePath + '/update/json?softCommit=true&wt=json'
  //           );
  //         }
  //         sassert.ok(err, data);
  //         done();
  //       }
  //     );
  //   });
  // });
  // describe('#deleteByID(1,{commitWithin : 10000},callback)', function () {
  //   it('should delete the document with the id 1 and commit changes within 10s', function (done) {
  //     const request = client.deleteByID(
  //       1,
  //       { commitWithin: 10000 },
  //       function (err, data) {
  //         if (
  //           client.solrVersion &&
  //           versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
  //         ) {
  //           assert.equal(
  //             request.path,
  //             basePath + '/update?commitWithin=10000&wt=json'
  //           );
  //         } else {
  //           assert.equal(
  //             request.path,
  //             basePath + '/update/json?commitWithin=10000&wt=json'
  //           );
  //         }
  //         sassert.ok(err, data);
  //         done();
  //       }
  //     );
  //   });
  // });
  // describe('#deleteByID(1,{commit : true},callback)', function () {
  //   it('should delete the document with the id 1 and hard commit changes', function (done) {
  //     const request = client.deleteByID(
  //       1,
  //       { commit: true },
  //       function (err, data) {
  //         if (
  //           client.solrVersion &&
  //           versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
  //         ) {
  //           assert.equal(
  //             request.path,
  //             basePath + '/update?commit=true&wt=json'
  //           );
  //         } else {
  //           assert.equal(
  //             request.path,
  //             basePath + '/update/json?commit=true&wt=json'
  //           );
  //         }
  //         sassert.ok(err, data);
  //         done();
  //       }
  //     );
  //   });
  // });
});
