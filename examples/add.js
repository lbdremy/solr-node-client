/**
 * Add documents into the Solr index.
 */
const solr = require('./../lib/solr');

// Create a client
const client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

const docs = [];
for (let i = 0; i <= 10; i++) {
  const doc = {
    id: 12345 + i,
    title_t: 'Title ' + i,
    description_t: 'Text' + i + 'Alice',
  };
  docs.push(doc);
}

// Add documents
client.add(docs, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
