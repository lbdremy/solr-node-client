var solr = require('./../lib/solr');

var client = solr.createClient();

client.commit(function(json,err){
   if(err) console.log(err);
   if(json) console.log(json);
});
var options = {
   waitFlush: false ,
   waitSearcher: false
   };
client.commit(options,function(json,err){
   if(err) console.log(err);
   if(json) console.log(json);
});
