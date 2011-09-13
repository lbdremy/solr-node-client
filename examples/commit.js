var solr = require('./../lib/solr');

var client = solr.createClient();

client.commit(function(err,res){
   if(err) console.log(err);
   if(json) console.log(res);
});
var options = {
   waitFlush: false ,
   waitSearcher: false
   };
client.commit(options,function(err,res){
   if(err) console.log(err);
   if(json) console.log(res);
});
