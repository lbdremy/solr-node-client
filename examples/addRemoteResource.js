/**
 * Add remote resource into the Solr index.
 */
const solr = require('./../lib/solr');

// Create a client
const client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

const options = {
  path: '/home/lbdremy/Downloads/merchant-directory.csv',
  format: 'csv',
};
client.addRemoteResource(options, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
