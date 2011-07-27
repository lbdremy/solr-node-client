// Dependencies 
var solr = require('./../lib/solr'),
   vows = require('vows'),
   assert = require('assert');
 

var client = solr.createClient();
var callback = function(json,err){
   if(err) console.log('Error:' + err);
   console.log('JSON:'+json);
}
var keywords = ['laptop','json','tv','lol','mdr'];
for(var i = 0 ; i < keywords.length ; i++){
   client.query('description_t',keywords[i],0,20,callback);
}
