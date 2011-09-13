var solr = require('./../lib/solr');

var client = solr.createClient();
var callback = function(err,res){
   if(err) console.log(err);
   if(json) console.log(res);
}
client.rollback(callback);
