var solr = require('./../lib/solr');

var client = solr.createClient();
var callback = function(err,res){
   if(err) console.log(err);
   if(res) console.log(res);
}

//client.deleteByID(455,callback);
client.delete('id','*',callback); //Delete every single row

//client.commit();
