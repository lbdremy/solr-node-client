var solr = require('./../lib/solr');

var client = solr.createClient();
var callback = function(json,err){
   if(err) console.log(err);
   if(json) console.log(json);
}
client.rollback(callback);
