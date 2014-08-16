// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();
var query = client.createQuery()
               .q('*:*')
               .rows(0)
               .facet({
                  field : 'title',
                  prefix : 'Ipa',
                  query : 'title:Ipad',
                  limit : 20,
                  offset : 0,
                  sort : 'count',
                  mincount : 0,
                  missing : false,
                  method : 'fc' ,
               });

client.search(query,function(err,obj){
   if(err){
      console.log(err);
   }else{
      console.log(obj);
   }
});