var solr = require('./../lib/solr');

var client = solr.createClient();
var callback = function(err,res){
   if(err) console.log(err);
   if(json) console.log(res);
}

var options = {
   waitFlush: false ,
   waitSearcher: true
};
client.optimize(options,callback);
//client.optimize();
// waitFlush : default is true
// waitSearcher : default is true
