import * as figc from 'figc';
import * as sassert from './sassert';
import { createClient } from '../lib/solr';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#commit(callback)', function () {
    it('should commit', function (done) {
      client.commit({}, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
  describe('#commit({softCommit : true},callback)', function () {
    it('should commit with the softCommit option enabled', function (done) {
      client.commit({ softCommit: true }, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
  describe('#commit({waitSearcher : true},callback)', function () {
    it('should commit with the waitSearcher option enabled', function (done) {
      client.commit({ waitSearcher: true }, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
  describe('#commit({unknownOption : true},callback)', function () {
    it('should return a `SolrError`', function (done) {
      client.commit({ unknownOption: true }, function (err) {
        sassert.nok(err);
        done();
      });
    });
  });
});
