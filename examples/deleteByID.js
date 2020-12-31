/**
 * Delete document with the given `id`
 */
const solr = require('./../lib/solr');

const client = solr.createClient();

const id = 38738;
client.deleteByID(id, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
  // Do not forget to commit now
  // to see the changes
});
