/**
 * Macros to assert Solr response.
 */

import { assert } from 'chai';
import { SolrError } from '../lib/error/solr-error';

export function ok(err?: Error | null, data?: Record<string, any>) {
  assert.isNull(err, `Response was not ok: ${err && err.message}`);
  assert.isObject(data);
  assert.equal(data?.responseHeader.status, 0);
}

export function nok(err) {
  assert.instanceOf(err, SolrError);
}

export function dataOk(data?: Record<string, any>) {
  assert.isObject(data);
  assert.equal(data?.responseHeader.status, 0);
}
