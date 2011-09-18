 var solr = require('./../lib/solr');
 

var client = solr.createClient();

var callback = function(err,res){
   if(err) console.log('Error:' + err);
   if(res) console.log('res:' + res);
}
client.autoCommit = true;
client.updateEach = 4;
for(var i = 0; i <= 2 ; i++){
   var doc = {
       id : 82893 + i,
       title : "Title "+ i,
       description : "Text"+ i + "Alice"
   }
   client.add(doc,callback);
}

client.purgeAdd(callback);
