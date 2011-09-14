var solr = require('./../lib/solr');

var client = solr.createClient();
var callback = function(err,res){
   if(err) console.log(err);
   if(res) console.log(res);
}

var start = new Date();
start.setDate(start.getDate() -1);
var stop = new Date();
client.deleteByRange('last_update',start,stop,callback);

client.commit();
