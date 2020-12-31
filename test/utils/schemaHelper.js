const { postJSON } = require('../../lib/client')

function createSchemaField(solr, fieldName, fieldType, cb) {
    const payload = {
        "add-field":{
            "name":fieldName,
            "type":fieldType,
            "multiValued": false,
            "stored":true }
    }

    const params = {
        host : solr.options.host,
        port : solr.options.port,
        fullPath : `http://localhost:8983/solr/testcore/schema`,
        json : JSON.stringify(payload),
        secure : solr.options.secure,
        bigint : solr.options.bigint,
        authorization : solr.options.authorization,
        agent : solr.options.agent,
        ipVersion : solr.options.ipVersion
    };
  postJSON(
      params,
      (err, result) => {
          if (err) {
              // ToDo We should handle this in a more robust way in the future, but there is a difference between default setup in Solr 5 and Solr 8,
              // so some fields already exist in Solr 8. Hence if that's the case, we just ignore that.
              console.warn(err.message)
          }
          cb(result);
      }
  )
}

module.exports = {
    createSchemaField
}
