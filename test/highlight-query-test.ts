import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './utils/sassert';
import { HlOptions } from '../lib/types';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery()', function () {
  describe('.hl(options)', function () {
    it('should create a highlighted query with most options specified (strings only).', async function () {
      const highlightOptions: HlOptions = {
        on: true,
        q: 'query',
        qparser: 'lucene',
        fl: 'author',
        snippets: 1,
        fragsize: 100,
        mergeContiguous: false,
        requireFieldMatch: false,
        maxAnalyzedChars: 51200,
        maxMultiValuedToExamine: 100,
        maxMultiValuedToMatch: 100,
        alternateField: '',
        maxAlternateFieldLength: -1,
        formatter: 'simple',
        simplePre: '<',
        simplePost: '>',
        fragmenter: 'gap',
        usePhraseHighlighter: true,
        highlightMultiTerm: true,
        preserveMulti: false,
        payloads: false,
      };
      const query = client
        .query()
        .hl(highlightOptions)
        .q({ title_t: 'test' })
        .debugQuery();
      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        debugQuery: 'true',
        'hl.mergeContiguous': 'false',
        'hl.qparser': 'lucene',
        wt: 'json',
        'hl.requireFieldMatch': 'false',
        'hl.fragsize': '100',
        'hl.fragmenter': 'gap',
        'hl.maxMultiValuedToMatch': '100',
        'hl.simple.pre': '<',
        'hl.fl': 'author',
        'hl.maxAnalyzedChars': '51200',
        'hl.maxMultiValuedToExamine': '100',
        hl: 'true',
        'hl.payloads': 'false',
        'hl.highlightMultiTerm': 'true',
        'hl.snippets': '1',
        'hl.maxAlternateFieldLength': '-1',
        q: 'title_t:test',
        'hl.preserveMulti': 'false',
        'hl.q': 'query',
        'hl.formatter': 'simple',
        'hl.simple.post': '>',
        'hl.usePhraseHighlighter': 'true',
      });
      assert.equal(data.debug?.QParser, 'LuceneQParser');
    });

    it('should create a highlighted query with a second set of options specified.', async function () {
      const highlightOptions = {
        on: true,
        q: { id: 'id', title_t: 'title' },
        fl: ['author', 'title_t'],
        fragmenter: 'regex',
        regexSlop: 0.6,
        regexPattern: '',
        regexMaxAnalyzedChars: 10000,
      };
      const query = client
        .query()
        .hl(highlightOptions)
        .q({ title_t: 'test' })
        .debugQuery();
      const data = await client.search(query);
      dataOk(data);
      assert.deepEqual(data.responseHeader.params, {
        'hl.regex.maxAnalyzedChars': '10000',
        debugQuery: 'true',
        q: 'title_t:test',
        'hl.regex.slop': '0.6',
        'hl.fragmenter': 'regex',
        'hl.q': 'id:id AND title_t:title',
        'hl.simple.pre': '<em>',
        'hl.simple.post': '</em>',
        'hl.fl': 'author,title_t',
        wt: 'json',
        hl: 'true',
      });

      assert.equal(data.debug?.QParser, 'LuceneQParser');
    });
  });
});
