import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './utils/sassert';
import * as versionUtils from '../lib/utils/version';
import { FacetOptions } from '../lib/types';

//TODO support all stuff describe there
// http://wiki.apache.org/solr/SimpleFacetParameters#Retrieve_docs_with_facets_missing
// and http://wiki.apache.org/solr/HierarchicalFaceting

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery()', function () {
  describe('.facet(options)', function () {
    it('should create a facet with pivot on multiple fields', function (done) {
      const facetOptions: FacetOptions = {
        on: true,
        query: 'query',
        field: 'author',
        prefix: 'prefix',
        sort: 'field desc',
        limit: 100,
        offset: 5,
        mincount: 10,
        missing: true,
        method: 'fc',
        pivot: {
          fields: ['cat', 'popularity'],
          mincount: 10,
        },
      };
      const query = client
        .query()
        .facet(facetOptions)
        .q({ title_t: 'test' })
        .debugQuery();
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        const validationJSON = {
          facet: 'true',
          wt: 'json',
          debugQuery: 'true',
          q: 'title_t:test',
          'facet.field': 'author',
          'facet.limit': '100',
          'facet.method': 'fc',
          'facet.mincount': '10',
          'facet.missing': 'true',
          'facet.offset': '5',
          'facet.prefix': 'prefix',
          'facet.query': 'query',
          'facet.sort': 'field desc',
        };

        if (
          client.solrVersion &&
          versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
        ) {
          validationJSON['facet.pivot.mincount'] = '10';
          validationJSON['facet.pivot'] = ['cat', 'popularity'];
        }

        assert.deepEqual(data.responseHeader.params, validationJSON);
        assert.equal(data.debug.QParser, 'LuceneQParser');
        done();
      });
    });

    it('should create a facet with pivot on a single field', function (done) {
      const facetOptions = {
        on: true,
        query: 'query',
        field: 'author',
        prefix: 'prefix',
        sort: 'field desc',
        limit: 100,
        offset: 5,
        mincount: 10,
        missing: true,
        method: 'fc',
        pivot: {
          fields: 'cat',
          mincount: 10,
        },
      };
      const query = client
        .query()
        .facet(facetOptions)
        .q({ title_t: 'test' })
        .debugQuery();
      client.search(query, function (err, data) {
        sassert.ok(err, data);
        const validationJSON = {
          facet: 'true',
          wt: 'json',
          debugQuery: 'true',
          q: 'title_t:test',
          'facet.field': 'author',
          'facet.limit': '100',
          'facet.method': 'fc',
          'facet.mincount': '10',
          'facet.missing': 'true',
          'facet.offset': '5',
          'facet.prefix': 'prefix',
          'facet.query': 'query',
          'facet.sort': 'field desc',
        };

        if (
          client.solrVersion &&
          versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
        ) {
          validationJSON['facet.pivot.mincount'] = '10';
          validationJSON['facet.pivot'] = 'cat';
        }

        assert.deepEqual(data.responseHeader.params, validationJSON);
        assert.equal(data.debug.QParser, 'LuceneQParser');
        done();
      });
    });
  });
});
