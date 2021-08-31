import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#search("q=*:*")', function () {
    it('should find all documents', function (done) {
      client.search('q=*:*', function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual({ q: '*:*', wt: 'json' }, data.responseHeader.params);
        done();
      });
    });
  });
  describe('#search(query)', function () {
    it('should find documents describe in the `query` instance of `Query`', function (done) {
      const query = client.query().q({
        title_t: 'test',
      });
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(
          { q: 'title_t:test', wt: 'json' },
          data.responseHeader.params
        );
        done();
      });
    });
  });
});
