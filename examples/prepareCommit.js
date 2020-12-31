/**
 * Prepare commit
 */
const solr = require('./../lib/solr');

const client = solr.createClient();

client.prepareCommit(function (err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
});
