/**
 * Search documents matching the `query` with Spellcheck enabled.
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();
var query = client.createQuery()
				  .q('laptop');
client.spell(query,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
});