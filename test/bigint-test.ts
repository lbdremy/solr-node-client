/**
 * Testing support for really big long values in json coming from Solr, especially values that are bigger then what
 * JS can keep in Number variables without losing precision.
 */

import * as figc from 'figc';
import * as sassert from './utils/sassert';
import { assert } from 'chai';
import { createClient } from '../lib/solr';
import BigNumber from 'bignumber.js';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient({ ...config.client, bigint: true });
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client', function () {
  describe('Checking support for longs passed down in json formats to/from solr', function () {
    let _version_ = new BigNumber(-1); // -1 ensures document doesn't exist prior to test
    const id = 'RandomId-' + Math.floor(Math.random() * 1000000);
    const big = '9007199254740993'; // deliberately kept as a string to avoid truncate before test
    const small = '97'; // same showing string-conversion is not at fault
    const doc: Record<string, any> = {
      id: id,
      small_l: small,
      big_l: big,
      _version_: _version_.toString(),
    };
    const add_options = {
      commit: true, // force commit, not really needed, but it ensures full process cycle at solr side
      versions: true, // feedback optimistic concurrency info for later update
    };

    it('should add the document with commit and versions true', async function () {
      const response = await client.add(doc, add_options);
      dataOk(response);
      assert.ok(
        big != Number(big).toString(),
        'the big number used for testing should exceed the limits of javascript Number variables'
      );
      assert.ok(
        big == new BigNumber(big).toString(),
        'the big number used for testing should not exceed the limits of BigNumber processing'
      );
      _version_ = new BigNumber(response.adds[1].toString());
      assert.ok(
        _version_.comparedTo(0) == 1,
        '_version_ should be set to a positive number'
      );
    });

    it('should be able to get that specific document with the big-long unchange and in full glory', async function () {
      // note that by default the /get handler will have omitHeader=true configured on the server!
      const data = await client.realTimeGet<any>(id, { omitHeader: false });
      dataOk(data);
      assert.equal(
        data.response.numFound,
        1,
        'Added document should be retrieved in real-time get.'
      );
      const retrieved = data.response.docs[0];
      assert.equal(retrieved.id, id, "Didn't retrieve the expected document.");
      assert.equal(
        retrieved.small_l.toString(),
        small,
        "Didn't retrieve the expected small value."
      );
      assert.equal(
        retrieved.big_l.toString(),
        big,
        "Didn't retrieve the expected big value."
      );
      assert.equal(
        retrieved._version_.toString(),
        _version_,
        "Didn't retrieve the expected big value."
      );
    });

    it('should be able to update that specific document when respecting optimistic lock needs', async function () {
      doc._version_ = _version_.toString(); // needed for optimistic lock check
      doc.new_t = 'new text field';

      const data = await client.add(doc, add_options);
      dataOk(data);
      const prev_version_ = _version_;
      _version_ = new BigNumber(data.adds[1].toString());
      assert.ok(
        _version_.comparedTo(prev_version_) == 1,
        'new _version_ should be bigger then previous'
      );
    });

    it('should be able to delete it', async function () {
      const data = await client.deleteByID(id);
      dataOk(data);
    });
  });
});
