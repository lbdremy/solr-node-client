const http = require('http'),
  https = require('https'),
  SolrError = require('./error/solr-error'),
  JSONbig = require('json-bigint');

/**
 * Pick appropriate protocol based on the given `secure` flag
 *
 * @param {Boolean} secure -
 * @return {Object} http or https module
 * @api private
 */

function pickProtocol(secure) {
  return secure ? https : http;
}

/**
 * Pick appropriate JSON serializer/deserializer library based on the given `bigint` flag
 * @param {Boolean} bigint - whenever to handle big number correctly or not (the reason for not using JSONbig all the times is it has an important performance cost)
 * @return {Object} JSON or JSONbig serializer/deserializer
 * @api private
 */

function pickJSON(bigint) {
  return bigint ? JSONbig : JSON;
}

/**
 * Handle HTTP JSON response from Solr
 *
 * @param request - TODO document this parameter.
 * @param bigint - TODO document this parameter.
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @api private
 */

function handleJSONResponse(request, bigint, callback) {
  return function onJSONResponse(response) {
    let text = '';
    let err = null;
    let data = null;

    // This properly handles multi-byte characters
    response.setEncoding('utf-8');

    response.on('data', function (chunk) {
      text += chunk;
    });

    response.on('end', function () {
      if (response.statusCode < 200 || response.statusCode > 299) {
        err = new SolrError(request, response, text);
        if (callback) {
          callback(err, null);
        }
      } else {
        try {
          data = pickJSON(bigint).parse(text);
        } catch (error) {
          err = error;
        } finally {
          if (callback) {
            callback(err, data);
          }
        }
      }
    });
  };
}

module.exports = {
  handleJSONResponse,
  pickJSON,
  pickProtocol,
};
