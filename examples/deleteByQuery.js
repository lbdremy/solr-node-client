/**
 * Delete documents matching the given `query`
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

var query = 'title_t:Hello';
client.deleteByQuery(query,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
   // Do not forget to commit now
   // to see the changes
});


