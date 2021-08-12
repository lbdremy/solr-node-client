/**
 * Rollback changes after the last commit.
 */
const solr = require('../lib/solr');

const client = solr.createClient();

client.rollback(function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
