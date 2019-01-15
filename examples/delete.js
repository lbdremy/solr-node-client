/**
 * Delete set of documents 
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');

var client = solr.createClient();

var field = 'id';
var query = '*'; // Everything !Dangerous!

// Delete every documents
client.delete(field,query,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);	
   }
}); 

