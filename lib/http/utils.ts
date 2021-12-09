const JSONbig = require('json-bigint');

/**
 * Pick appropriate JSON serializer/deserializer library based on the given `bigint` flag
 *
 * @param bigint
 *   Whether to handle big numbers correctly or not.
 *   The reason for not using JSONbig all the times is it has a significant performance cost.
 *
 * @return
 *   JSON or JSONbig serializer/deserializer
 */
export function pickJSON(bigint: boolean): typeof JSON | typeof JSONbig {
  return bigint ? JSONbig : JSON;
}
