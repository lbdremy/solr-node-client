/**
 * Ping the Solr server
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

client.ping(function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
});
