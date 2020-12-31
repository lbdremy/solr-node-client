// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();
var query = client.createQuery().q('*:*').rows(0).hl({
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
