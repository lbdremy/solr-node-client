/**
 * Commit your changes in the index with or without options. 
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');

var client = solr.createClient();

// Soft commit
client.commit({ softCommit : true },function(err,res){
   if(err) console.log(err);
   if(res) console.log(res);
});
