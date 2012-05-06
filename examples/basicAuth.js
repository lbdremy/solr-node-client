/**
 * Use Basic HTTP Authentication to communicate with the Solr server. 
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');

var client = solr.createClient();
client.basicAuth('admin','passtest');

// Use `client.unauth` if you want to remove credentials previously set.
//client.unauth();

// You can now search documents using your credentials
var query = client.createQuery().q('laptop').dismax().qf({title_t : 0.2 , description_t : 3.3}).mm(2).start(0).rows(10);
client.search(query,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);	
   }
});

