/**
 * Testing support for http://wiki.apache.org/solr/TermsComponent
 */
import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery', function () {
  describe('#terms(options), callback)', function () {
    it('should create a Terms query and termsSearch', function (done) {
      const options = {
        on: true,
        fl: 'title',
        prefix: 's',
        mincount: 1,
        maxcount: 10,
        limit: 5,
        sort: 'index',
      };

      const query = client.query().terms(options).debugQuery();

      client.termsSearch(query, function (err, data) {
        sassert.ok(err, data);
        assert.isObject(data.terms);
        done();
      });
    });
  });
});
