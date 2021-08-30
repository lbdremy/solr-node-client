// Testing support for Real-Time GET -- https://wiki.apache.org/solr/RealTimeGet
/**
 * Modules dependencies
 */
const figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr');
import * as sassert from './sassert';

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('Real-time-get functionality', function () {
    const id = 'RandomId-' + Math.floor(Math.random() * 1000000);
    const title = 'the title for ' + id;
    const doc = { id: id, title_t: title };

    it('should add one document with a long period before committing', function (done) {
      const options = {
        commitWithin: 10000000, //extremely long, giving us plenty of time to test
      };
      client.add(doc, options, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });

    it('should not find that document in the index yet', function (done) {
      const query = client.createQuery();
      query.matchFilter('id', id);
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal(
          data.response.numFound,
          0,
          'Added document should not be index and thus not found.'
        );
        done();
      });
    });

    it('should be able to get that specific document', function (done) {
      // note that by default the /get handler will have omitHeader=true configured on the server!
      client.realTimeGet(id, { omitHeader: false }, function (err, data) {
        sassert.ok(err, data);
        assert.equal(
          data.response.numFound,
          1,
          'Added document should be retrieved in real-time get.'
        );
        const retrieved = data.response.docs[0];
        assert.equal(
          retrieved.id,
          id,
          "Didn't retrieve the expected document."
        );
        assert.equal(
          retrieved.title_t,
          title,
          "Didn't retrieve the expected document."
        );
        done();
      });
    });

    it('should be able to delete it', function (done) {
      client.deleteByID(id, function (err, data) {
        sassert.ok(err, data);
        done();
      });
    });

    it('should no longer be able to get that specific document', function (done) {
      client.realTimeGet(id, { omitHeader: false }, function (err, data) {
        sassert.ok(err, data);
        assert.equal(
          data.response.numFound,
          0,
          'Deleted document should no longer be retrievable in real-time get.'
        );
        done();
      });
    });
  });
});
