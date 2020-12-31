/**
 * Delete set of documents based on a range
 */
const solr = require('./../lib/solr');

const client = solr.createClient();

const startOffset = new Date();
start.setDate(start.getDate() - 1);
const stopOffset = new Date();
client.deleteByRange(
  'last_update',
  startOffset,
  stopOffset,
  function (err, obj) {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
    // Do not forget to commit now
    // to see the changes
  }
);
