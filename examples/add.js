 var solr = require('./../lib/solr');
 

var client = solr.createClient();

var callback = function(json,err){
   if(err) console.log('Error:' + err);
   if(json) console.log('JSON:' + json);
}
client.autoCommit = true;
client.updateEach = 4;
for(var i = 0; i <= 2 ; i++){
   var doc = {
       id : 82893 + i,
       title_t : "Title "+ i,
       text_t : "Text"+ i + "Alice"
   }
   client.add(doc,callback);
}

client.purgeAdd(callback);
