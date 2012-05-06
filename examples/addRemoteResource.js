/**
 * Add remote resource into the Solr index.
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');

// Create a client
var client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

var options = {
	path : '/home/lbdremy/Downloads/merchant-directory.csv',
	format : 'csv'
}
client.addRemoteResource(options,function(err,obj){
   if(err){
      console.log(err);
   }else{
      console.log(obj);
   }
});
