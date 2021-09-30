/**
 * Testing support for Real-Time GET -- https://wiki.apache.org/solr/RealTimeGet
 */
import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';
import { dataOk } from './sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('Real-time-get functionality', function () {
    const id = 'RandomId-' + Math.floor(Math.random() * 1000000);
    const title = 'the title for ' + id;
    const doc = { id: id, title_t: title };

    it('should add one document with a long period before committing', async function () {
      const options = {
        commitWithin: 10000000, //extremely long, giving us plenty of time to test
      };
      const data = await client.add(doc, options);
      dataOk(data);
    });
    //TODO
    // it('should not find that document in the index yet', function (done) {
    //   const query = client.query();
    //   query.matchFilter('id', id);
    //   client.search(query, function (err, data) {
    //     sassert.ok(err, data);
    //     assert.equal(
    //       data.response.numFound,
    //       0,
    //       'Added document should not be index and thus not found.'
    //     );
    //     done();
    //   });
    // });
    //
    // it('should be able to get that specific document', function (done) {
    //   // note that by default the /get handler will have omitHeader=true configured on the server!
    //   client.realTimeGet(id, { omitHeader: false }, function (err, data) {
    //     sassert.ok(err, data);
    //     assert.equal(
    //       data.response.numFound,
    //       1,
    //       'Added document should be retrieved in real-time get.'
    //     );
    //     const retrieved = data.response.docs[0];
    //     assert.equal(
    //       retrieved.id,
    //       id,
    //       "Didn't retrieve the expected document."
    //     );
    //     assert.equal(
    //       retrieved.title_t,
    //       title,
    //       "Didn't retrieve the expected document."
    //     );
    //     done();
    //   });
    // });
    //
    it('should be able to delete it', async function () {
      await client.deleteByID(id);
    });
    //TODO
    // it('should no longer be able to get that specific document', function (done) {
    //   client.realTimeGet(id, { omitHeader: false }, function (err, data) {
    //     sassert.ok(err, data);
    //     assert.equal(
    //       data.response.numFound,
    //       0,
    //       'Deleted document should no longer be retrievable in real-time get.'
    //     );
    //     done();
    //   });
    // });
  });
});
