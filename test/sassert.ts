/**
 * Modules dependencies
 */

const assert = require('chai').assert

// ToDo See if we still need it
// libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib';
import { SolrError } from '../lib/error/solr-error';

// Macros to assert Solr response

export function ok(err?: Error | null, data?: Record<string, any>) {
  assert.isNull(err, `Response was not ok: ${err && err.message}`);
  assert.isObject(data);
  assert.equal(data?.responseHeader.status, 0);
}

export function nok(err) {
  assert.instanceOf(err, SolrError);
}
