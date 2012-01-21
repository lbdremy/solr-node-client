//Dependency
var solr = require('./../lib/solr');

var client = solr.createClient();
client.basicAuth('admi','passtest');
console.log('Authorization header: ' + client.options.authorization);
//client.unauth();
console.log(client.options.authorization ? 'Still auth.' : 'Unauth');

var callback = function(err,res){
   if(err) console.log('Error:' + err);
   console.log('JSON:'+res);
}

var query = client.createQuery().q('laptop').dismax().qf({title_t : 0.2 , description_t : 3.3}).mm(2).start(0).rows(10);
client.query(query,callback);
