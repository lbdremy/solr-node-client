/**
 * Use real-time get feature
 */
const solr = require('./../lib/solr');

const client = solr.createClient();

// Retrieve only one document
const id = 3973873;
client.realTimeGet(id, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});

// Retrieve multiple documents
const ids = [4874847, 9449747, 949448];
client.realTimeGet(ids, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
