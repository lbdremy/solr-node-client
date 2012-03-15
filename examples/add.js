/**
 * Load dependency
 */
 
var solr = require('./../lib/solr');

// Create a client
var client = solr.createClient();

// function executed when the Solr server responds
var callback = function(err,json){
   if(err){
      console.log(err);
   }else{
      console.log('JSON response:' + json);
   }
}

// Auto commit document added.
client.autoCommit = true;

// Send a request every time there are 4 or more documents added with the function add()
client.updateEach = 4;

var docs = [];
for(var i = 0; i <= 10 ; i++){
   var doc = {
       id : 82893 + i,
       title : "Title "+ i,
       description : "Text"+ i + "Alice"
   }
   docs.push(doc);
}

// Add documents and flush added documents
client.add(docs,callback);
client.flushAdd(callback);
