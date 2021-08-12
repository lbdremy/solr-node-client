/**
 * Search all documents
 *    tiny shorhand command for commodity
 */
const solr = require('../lib/solr');

const client = solr.createClient();

client.searchAll(function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
