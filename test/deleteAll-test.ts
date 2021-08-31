import * as figc from 'figc';
import * as sassert from './sassert';
import { createClient } from '../lib/solr';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#deleteAll(callback)', function () {
    it('should delete all documents', function (done) {
      client.deleteAll({}, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });
  });
});
