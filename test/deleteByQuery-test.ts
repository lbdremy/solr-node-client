import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './utils/sassert';
import * as versionUtils from '../lib/utils/version';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#deleteByQuery("title_t:*",callback)', function () {
    it('should delete all documents having the field title_t', async function () {
      await client.deleteByQuery('title_t:*');
    });
  });
  //TODO
  // describe('#deleteByQuery("title_t:*",{softCommit : true },callback)', function () {
  //   it('should delete all documents having the field title_t with the soft commit option enabled', function (done) {
  //     const request = client.deleteByQuery(
  //       'title_t:*',
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
  // describe('#deleteByQuery("title_t:*",{commitWithin : 10000},callback)', function () {
  //   it('should delete all documents having the field title_t and commit changes within 10s', function (done) {
  //     const request = client.deleteByQuery(
  //       'title_t:*',
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
  // describe('#deleteByQuery("title_t:*",{commit : true},callback)', function () {
  //   it('should delete all documents having the field title_t and hard commit changes', function (done) {
  //     const request = client.deleteByQuery(
  //       'title_t:*',
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
