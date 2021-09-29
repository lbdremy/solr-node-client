import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';
import { dataOk } from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

/**
 * `atomicUpdate` is just an alias of `update`.
 */
describe('Client', function () {
  describe('#Atomic update({ id : 1, title_t : "Modified title"},callback)', function () {
    const doc_id = 'RandomId-' + Math.floor(Math.random() * 1000000);
    const small = '97'; // same showing string-conversion is not at fault
    const doc = {
      id: doc_id,
      small_l: small,
      title_t: 'Original title',
    };
    const options = {
      commit: true, // force commit, not really needed, but it ensures full process cycle at solr side
    };

    it('should add one document', async function () {
      const data = await client.add(doc, options);
      dataOk(data);
    });

    it('should partially update one document', async function () {
      const updatedDoc = {
        id: doc_id,
        title_t: { set: 'Modified title' },
      };
      const data = await client.atomicUpdate(updatedDoc);
      dataOk(data);
    });
//TODO
    // it('should have updated the document', function (done) {
    //   client.realTimeGet(doc_id, { omitHeader: false }, function (err, data) {
    //     sassert.ok(err, data);
    //     assert.equal(
    //       data.response.numFound,
    //       1,
    //       'Updated document should be retrieved in real-time get.'
    //     );
    //     const retrieved = data.response.docs[0];
    //     assert.equal(
    //       retrieved.title_t,
    //       'Modified title',
    //       'Updated document should have a modified title.'
    //     );
    //     assert.equal(
    //       retrieved.id,
    //       doc_id,
    //       'Updated document should have the same id'
    //     );
    //     assert.equal(
    //       retrieved.small_l,
    //       small,
    //       'Updated document should have the same old small value'
    //     );
    //     done();
    //   });
    // });
    //
    it('should be able to delete it', async function () {
      await client.deleteByID(doc_id, options);
    });
  });
});
