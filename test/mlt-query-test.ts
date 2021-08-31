/**
 * Testing support for http://wiki.apache.org/solr/MoreLikeThis
 */
import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';
import { MltOptions } from '../lib/types';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery', function () {
  describe('#mlt(options), callback)', function () {
    it('should create a MoreLikeThis query', function (done) {
      const options: MltOptions = {
        on: true,
        fl: ['content', 'title'],
        count: 15,
        mintf: 0,
        mindf: 0,
        minwl: 0,
        maxwl: 1500,
        maxqt: 1500,
        maxntp: 1500,
        boost: true,
        qf: 1,
      };

      const query = client
        .query()
        .mlt(options)
        .q({ title_t: 'test' })
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          'mlt.minwl': '0',
          'mlt.fl': 'content,title',
          'mlt.boost': 'true',
          'mlt.mintf': '0',
          'mlt.qf': '1',
          mlt: 'true',
          'mlt.maxwl': '1500',
          'mlt.maxntp': '1500',
          'mlt.maxqt': '1500',
          wt: 'json',
          'mlt.mindf': '0',
          'mlt.count': '15',
          debugQuery: 'true',
          q: 'title_t:test',
        });
        done();
      });
    });
  });
});
