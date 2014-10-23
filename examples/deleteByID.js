/**
 * Delete document with the given `id`
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

var id = 38738;
client.deleteByID(id,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
   // Do not forget to commit now
   // to see the changes
});

