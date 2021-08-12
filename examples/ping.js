/**
 * Ping the Solr server
 */
const solr = require('../lib/solr');

const client = solr.createClient();

client.ping(function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
