/**
 * Delete all documents
 */
const solr = require('../lib/solr');

const client = solr.createClient();

client.deleteAll(function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
  // Do not forget to commit now
  // to see the changes
});
