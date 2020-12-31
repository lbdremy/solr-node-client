/**
 * Delete set of documents
 */
const solr = require('./../lib/solr');

const client = solr.createClient();

const field = 'id';
const query = '*'; // Everything !Dangerous!

// Delete every documents
client.delete(field, query, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
