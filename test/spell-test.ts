import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#spell', function () {
    it('should test the "/spell" query handler/ spellchecker', function (done) {
      const query = client.query().q('test');
      client.spell(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal(0, data.responseHeader.status);
        done();
      });
    });
  });
});
