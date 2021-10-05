import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#doQuery("admin/ping",callback)', function () {
    it('should ping', function (done) {
      client.doQuery('admin/ping', '', function (err, data) {
        sassert.ok(err, data);
        assert.equal(data.status, 'OK');
        done();
      });
    });
  });
  describe('#doQuery("update/json", "softCommit=true", callback)', function () {
    it('should soft commit', function (done) {
      const request = client.doQuery(
        'update/json',
        'softCommit=true',
        function (err, data) {
          sassert.ok(err, data);
          assert.equal(
            request.path,
            basePath + '/update/json?softCommit=true&wt=json'
          );
          done();
        }
      );
    });
  });
  describe('#doQuery("select", query, callback)', function () {
    it('should find documents describe in the `query` instance of `Query`', function (done) {
      const query = client.query().q({
        title_t: 'test',
      });
      client.doQuery('select', query, function (err, data) {
        assert.deepEqual(
          { q: 'title_t:test', wt: 'json' },
          data.responseHeader.params
        );
        done();
      });
    });
  });
});
