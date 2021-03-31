// Testing support http://wiki.apache.org/solr/CommonQueryParameters
require('mocha');
/**
 * Modules dependencies
 */

const figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr'),
  sassert = require('./sassert');

// Test suite
const config = figc(__dirname + '/config.json');
const client = solr.createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');
const { createSchemaField } = require('./utils/schemaHelper');

describe('Client#createQuery', function () {
  before((cb) => {
    createSchemaField(client, 'title', 'text_general', () => {
      createSchemaField(client, 'name', 'text_general', () => {
        createSchemaField(client, 'author', 'text_general', cb);
      });
    });
  });

  describe('query() with various query options', function () {
    it('basic query with multiple fields', function (done) {
      const query = client
        .createQuery()
        .q({ title: 'name', author: 'me' })
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: 'title:name AND author:me',
          wt: 'json',
        });
        done();
      });
    });

    it('query sorted', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .sort({ author: 'asc' })
        .debugQuery(); // remove ', "category":"desc"' as newer solr doesn't support

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          sort: 'author asc',
          wt: 'json',
        });
        done();
      });
    });

    it('query with paging', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .start(21)
        .rows(20)
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          start: '21',
          rows: '20',
          wt: 'json',
        });
        done();
      });
    });

    it('query paged with cursorMark', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .start(0)
        .sort({ id: 'asc' })
        .cursorMark()
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          start: '0',
          sort: 'id asc',
          cursorMark: '*',
          wt: 'json',
        });
        done();
      });
    });

    it('custom parameter setting - allows for any Filterquery(fq)', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .set('fq=sqrt(id)')
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          fq: 'sqrt(id)',
          wt: 'json',
        });
        done();
      });
    });

    it('listing fields with fl', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .fl(['id', 'title*', 'score'])
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          fl: 'id,title*,score',
          wt: 'json',
        });
        done();
      });
    });

    it('escapes fl parameter', function (done) {
      // if it's not escaped correctly, SOLR returns HTTP 400
      const query = client
        .createQuery()
        .q('*:*')
        .fl(['id', 'score', "found_words:exists(query({!v='name:word'}))"]);
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          q: '*:*',
          fl: "id,score,found_words:exists(query({!v='name:word'}))",
          wt: 'json',
        });
        done();
      });
    });

    it('query with deftype', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .defType('lucene')
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          defType: 'lucene',
          wt: 'json',
        });
        done();
      });
    });

    it('query with time-allowed', function (done) {
      const query = client.createQuery().q('*:*').timeout(1000).debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          timeAllowed: '1000',
          wt: 'json',
        });
        done();
      });
    });

    it('q.op - Default query-operator', function (done) {
      const query = client
        .createQuery()
        .q('author:ali remy marc')
        .qop('OR')
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: 'author:ali remy marc',
          'q.op': 'OR',
          wt: 'json',
        });
        done();
      });
    });

    it('df - Default field query', function (done) {
      const query = client.createQuery().q('ali').df('author').debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: 'ali',
          df: 'author',
          wt: 'json',
        });
        done();
      });
    });

    it('query with range-filter', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .rangeFilter({ field: 'id', start: 100, end: 200 })
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          fq: 'id:[100 TO 200]',
          wt: 'json',
        });
        done();
      });
    });

    it('query with match-filter', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .matchFilter('id', '19700506.173.85')
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          fq: 'id:19700506.173.85',
          wt: 'json',
        });
        done();
      });
    });

    it('query with multiple match-filters', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .fq([{field: 'id', value: '19700506.173.85'}, {field: 'title', value: 'testvalue'}])
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          fq: ['id:19700506.173.85', 'title:testvalue'],
          wt: 'json',
        });
        done();
      });
    });

    it('query with object match-filter', function (done) {
      const query = client
        .createQuery()
        .q('*:*')
        .fq({field: 'id', value: '19700506.173.85'})
        .debugQuery();

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.deepEqual(data.responseHeader.params, {
          debugQuery: 'true',
          q: '*:*',
          fq: 'id:19700506.173.85',
          wt: 'json',
        });
        done();
      });
    });
  });
});
