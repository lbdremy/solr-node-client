import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery()', function () {
  describe('.dismax().q("test")', function () {
    it('should create a dismax query', function (done) {
      const query = client.query().dismax().q('test').debugQuery();
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          wt: 'json',
          q: 'test',
          defType: 'dismax',
        });
        assert.equal(data.debug.QParser, 'DisMaxQParser');
        done();
      });
    });
  });
});
