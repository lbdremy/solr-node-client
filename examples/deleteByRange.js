/**
 * Delete set of documents based on a range
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

var startOffset = new Date();
start.setDate(start.getDate() -1);
var stopOffset = new Date();
client.deleteByRange('last_update',startOffset,stopOffset,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
   // Do not forget to commit now
   // to see the changes
});


