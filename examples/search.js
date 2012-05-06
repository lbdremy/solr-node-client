/**
 * Search documents with DisMax query or Lucene query
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');

var client = solr.createClient();

// DixMax query
var query = client.createQuery()
				  .q('laptop')
				  .dismax()
				  .qf({title_t : 0.2 , description_t : 3.3})
				  .mm(2)
				  .start(0)
				  .rows(10);
client.search(query,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);	
   }
});

// Lucene query
var query2 = client.createQuery()
				   .q({title_t : 'laptop'})
				   .start(0)
				   .rows(10);
client.search(query2,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);	
   }
});
