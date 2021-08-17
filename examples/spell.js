/**
 * Search documents matching the `query` with Spellcheck enabled.
 */
const solr = require('../lib/solr');

const client = solr.createClient();
const query = client.createQuery().q('laptop');
client.spell(query, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
