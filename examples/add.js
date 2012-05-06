/**
 * Add documents into the Solr index.
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr'); 

// Create a client
var client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

var docs = [];
for(var i = 0; i <= 10 ; i++){
   var doc = {
       id : 12345 + i,
       title_t : "Title "+ i,
       description_t : "Text"+ i + "Alice"
   }
   docs.push(doc);
}

// Add documents
client.add(docs,function(err,obj){
   if(err){
      console.log(err);
   }else{
      console.log(obj);
   }
});
