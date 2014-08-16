/**
 * Search all documents
 * 	tiny shorhand command for commodity
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

client.searchAll(function(err,obj){
	if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
});