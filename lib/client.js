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
        if (callback) callback(err, null);
      } else {
        try {
          data = pickJSON(bigint).parse(text);
        } catch (error) {
          err = error;
        } finally {
          if (callback) callback(err, data);
        }
      }
    });
  };
}

/**
 * HTTP POST request. Send update commands to the Solr server (commit, add, delete, optimize)
 *
 * @param {Object} params
 * @param {String} params.host - IP address or host address of the Solr server
 * @param {Number|String} params.port - port of the Solr server
 * @param {String} params.core - name of the Solr core requested
 * @param {String} params.authorization - value of the authorization header
 * @param {String} params.fullPath - full path of the request
 * @param {String} params.json -
 * @param {Boolean} params.secure -
 * @param {Boolean} params.bigint -
 * @param {http.Agent} [params.agent] -
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api private
 */ function postJSON(params, callback) {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(params.json),
    accept: 'application/json; charset=utf-8',
  };
  if (params.authorization) {
    headers['authorization'] = params.authorization;
  }
  const options = {
    host: params.host,
    port: params.port,
    method: 'POST',
    headers: headers,
    path: params.fullPath,
    family: params.ipversion,
  };

  if (params.agent !== undefined) {
    options.agent = params.agent;
  }

  const request = pickProtocol(params.secure).request(options);

  request.on('response', handleJSONResponse(request, params.bigint, callback));

  request.on('error', function onError(err) {
    if (callback) callback(err, null);
  });

  request.write(params.json);
  request.end();

  return request;
}

module.exports = {
  handleJSONResponse,
  pickJSON,
  pickProtocol,
  postJSON,
};
