import * as http from 'http';
import * as https from 'https';
const JSONbig = require('json-bigint');

/**
 * Pick appropriate protocol based on the given `secure` flag
 *
 * @param {Boolean} secure -
 * @return {Object} http or https module
 * @api private
 */
function pickProtocol(secure: boolean): typeof http | typeof https {
  return secure ? https : http;
}

/**
 * Pick appropriate JSON serializer/deserializer library based on the given `bigint` flag
 * @param {Boolean} bigint - whenever to handle big number correctly or not (the reason for not using JSONbig all the times is it has an important performance cost)
 * @return {Object} JSON or JSONbig serializer/deserializer
 * @api private
 */
function pickJSON(bigint: boolean): typeof JSON | typeof JSONbig {
  return bigint ? JSONbig : JSON;
}

module.exports = {
  pickJSON,
  pickProtocol,
};
