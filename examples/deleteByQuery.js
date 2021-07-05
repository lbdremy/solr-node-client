/**
 * Delete documents matching the given `query`
 */
const solr = require('./../lib/solr');

const client = solr.createClient();

const query = 'title_t:Hello';
client.deleteByQuery(query, {}, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
  // Do not forget to commit now
  // to see the changes
});
