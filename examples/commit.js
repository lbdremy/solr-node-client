/**
 * Commit your changes in the index with or without options. 
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');

var client = solr.createClient();

// Commit your changes without options
client.commit(function(err,res){
   if(err) console.log(err);
   if(res) console.log(res);
});

// Commit your changes with `waitSearcher` options.
var options = {
   waitSearcher: false
};
client.commit(options,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);	
   }
});
