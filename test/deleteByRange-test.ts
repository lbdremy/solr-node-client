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
  describe('#deleteByRange(field,start,stop,callback)', function () {
    it('should delete all documents between `start` and `stop` on the field `fied`', async function () {
      const field = 'last_update_dt';
      const start = new Date();
      const stop = new Date();
      stop.setDate(stop.getDate() - 1);
      await client.deleteByRange(field, start, stop);
    });
  });
  //TODO
  // describe('#deleteByRange(field,start,stop,{softCommit : true },callback)', function () {
  //   it('should delete all documents between `start` and `stop` on the field `fied` with the soft commit option enabled', async function () {
  //     const field = 'last_update_dt';
  //     const start = new Date();
  //     const stop = new Date();
  //     stop.setDate(stop.getDate() - 1);
  //     const request = client.deleteByRange(
  //       field,
  //       start,
  //       stop,
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
  //         dataOk(data);
  //         done();
  //       }
  //     );
  //   });
  // });
  // describe('#deleteByRange(field,start,stop,{commitWithin : 10000},callback)', function () {
  //   it('should delete all documents between `start` and `stop` on the field `fied` and commit changes within 10s', async function () {
  //     const field = 'last_update_dt';
  //     const start = new Date();
  //     const stop = new Date();
  //     stop.setDate(stop.getDate() - 1);
  //     const request = client.deleteByRange(
  //       field,
  //       start,
  //       stop,
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
  //         dataOk(data);
  //         done();
  //       }
  //     );
  //   });
  // });
  // describe('#deleteByRange(field,start,stop,{commit : true},callback)', function () {
  //   it('should delete all documents between `start` and `stop` on the field `fied` and hard commit changes', async function () {
  //     const field = 'last_update_dt';
  //     const start = new Date();
  //     const stop = new Date();
  //     stop.setDate(stop.getDate() - 1);
  //     const request = client.deleteByRange(
  //       field,
  //       start,
  //       stop,
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
  //         dataOk(data);
  //         done();
  //       }
  //     );
  //   });
  // });
});
