/**
 * Modules dependencies
 */
import { assert } from 'chai';
import * as sassert from './sassert';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as Stream from 'stream';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('#createAddStream()', function () {
    it('should return a `Stream`', function () {
      const addStream = client.createAddStream();
      assert.instanceOf(addStream, Stream);
    });
    describe('#write() to the `Stream` returned', function () {
      it('should add documents', async () => {
        await client.deleteAll();

        const addStream = client.createAddStream();
        let data = '';
        const addStreamPromise = new Promise((resolve, reject) => {
          addStream
            .on('end', function () {
              sassert.ok(null, JSON.parse(data));
              resolve(null);
            })
            .on('data', function (buffer) {
              data += buffer.toString();
            })
            .on('error', function (err) {
              sassert.ok(err);
              reject(err);
            });
          const n = 49;
          for (let i = 0; i < n; i++) {
            addStream.write({ id: i, title_t: 'title' + i, test_b: true });
          }
          addStream.end();
        });
        await addStreamPromise;
        await client.commit();

        const query = client.query().q({
          test_b: true,
        });
        const response = await client.search(query);
        assert.equal(response.response.numFound, 49);
      });
    });
  });
});
