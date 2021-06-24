const { handleJSONResponse } = require('../../lib/client');
const { pickProtocol } = require('../../lib/client');

// TODO: Should this be part of Client.prototype, rather than just live under
//  test/utils/schemaHelper.js?
function createSchemaField(solr, fieldName, fieldType, cb) {
  const json = JSON.stringify({
    'add-field': {
      name: fieldName,
      type: fieldType,
      multiValued: false,
      stored: true,
    },
  });

  const callback = (err, result) => {
    if (err) {
      // ToDo We should handle this in a more robust way in the future, but
      // there is a difference between default setup in Solr 5 and Solr 8, so
      // some fields already exist in Solr 8. Hence if that's the case, we just
      // ignore that.
      console.warn(err.message);
    }
    cb(undefined, result);
  };

  const requestOptions = {
    host: solr.options.host,
    port: solr.options.port,
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-length': Buffer.byteLength(json),
      accept: 'application/json; charset=utf-8',
    },
    path: 'http://localhost:8983/solr/testcore/schema',
    family: solr.options.ipVersion,
  };


  if (solr.options.authorization) {
    requestOptions.headers.authorization = solr.options.authorization;
  }

  if (solr.options.agent) {
    requestOptions.agent = solr.options.agent;
  }

  const request = pickProtocol(solr.options.secure).request(requestOptions);

  request.on('response', handleJSONResponse(request, solr.options.bigint, callback));

  request.on('error', function onError(err) {
    if (callback) callback(err, null);
  });

  request.write(json);
  request.end();

  return request;
}

module.exports = {
  createSchemaField,
};
