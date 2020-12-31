/**
 * Rollback changes after the last commit.
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

client.rollback(function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
