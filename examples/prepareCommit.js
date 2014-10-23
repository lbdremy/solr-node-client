/**
 * Prepare commit
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

client.prepareCommit(function(err,res){
   if(err){
   	console.log(err);
   }else{
   	console.log(res);
   }
});
