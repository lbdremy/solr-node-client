// Use `var solr = require('solr-client')` in your code
const solr = require('../lib/solr');

const client = solr.createClient();
const query = client.query().q('*:*').rows(0).hl({
  on: true,
  q: 'title:An Example Title to Highlight',
  fl: 'title',
});

client.search(query, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});
