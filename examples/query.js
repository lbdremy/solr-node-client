// Dependencies 
var solr = require('./../lib/solr'),
   vows = require('vows'),
   assert = require('assert');
 

var client = solr.createClient();
var callback = function(err,res){
   if(err) console.log('Error:' + err);
   console.log('JSON:'+res);
}

var query = client.createQuery().q('laptop').dismax().qf({title_t : 0.2 , description_t : 3.3}).mm(2).start(0).rows(10);
client.query(query,callback);
var query2 = client.createQuery().q({title_t : 'laptop'}).start(0).rows(10);
client.query(query2,callback);
