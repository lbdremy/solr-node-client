/**
 * Partially update a document into the Solr index.
 */
const solr = require('./../lib/solr');

// Create a client
const client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

const doc = {
  id: 12357,
  title_t: 'Original Title',
  small_l: 12,
  description_t: 'Some Description',
};

// Add documents
client.add([doc], {}, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});

// Add documents
client.atomicUpdate([doc], {}, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
