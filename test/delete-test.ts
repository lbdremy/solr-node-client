/**
 * Modules dependencies
 */
import * as figc from 'figc';
import * as sassert from './sassert';
import * as versionUtils from '../lib/utils/version';
import { assert } from 'chai';
import { createClient } from '../lib/solr';
import { dataOk } from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#delete("title_t","test",callback)', function () {
    it('should delete all documents where the field "title_t" is "test"', async function () {
      await client.delete('title_t', 'test');
    });
  });
  //TODO
  // describe('#delete("title_t","test",{ commit : true},callback)', function () {
  //   it('should delete all documents where the field "title_t" is "test" and hard commit all changes', function (done) {
  //     const request = client.delete(
  //       'title_t',
  //       'test',
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
  // describe('#delete("title_t","test",{ softCommit : true},callback)', function () {
  //   it('should delete all documents where the field "title_t" is "test" and soft commit all changes', function (done) {
  //     const request = client.delete(
  //       'title_t',
  //       'test',
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
  // describe('#delete("title_t","test",{ commitWithin : 10000},callback)', function () {
  //   it('should delete all documents where the field "title_t" is "test" and commit within 10s all changes', function (done) {
  //     const request = client.delete(
  //       'title_t',
  //       'test',
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
  describe('#delete("unknownField","test",callback)', function () {
    it('should return a `SolrError`', async function () {
      // client.delete('unknownField', 'test', function (err) {
      //   sassert.nok(err);
      //   done();
      await client.delete('unknownField', 'test');
    });
  });
});
