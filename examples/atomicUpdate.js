/**
 * Partially update a document into the Solr index.
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

// Create a client
var client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

var doc = {
  id: 12357,
  title_t: 'Original Title',
  small_l: 12,
  description_t: 'Some Description',
};

// Add documents
client.add(doc, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});

var updateDoc = {
  id: 12357,
  title_t: { set: 'Modified Title' },
  small_l: { inc: 2 },
};

// Add documents
client.atomicUpdate(doc, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
