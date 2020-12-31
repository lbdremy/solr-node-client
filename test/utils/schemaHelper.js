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
      cb
  )
}

module.exports = {
    createSchemaField
}
