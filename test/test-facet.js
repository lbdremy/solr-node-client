// Dependencies 
var solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert');

// Suite Test

var suite = vows.describe('Solr Client API: facet');

suite.addBatch({
   'Create a facet' : {
      'with the following options: `field`, `prefix`, `query`, `limit`, `offset`, `sort`, `limit`, `mincount`, `missing`, `method`' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery()
                           .q({'*' : '*'})
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
            client.query(query,this.callback);
         },
         'should return a correct response without error' :function(err,res) {
            assertCorrectResponse(err,res)
         }
      }
   }
}).export(module);

// Macro

function assertCorrectResponse(err,res){
   assert.isNull(err);
   var obj = JSON.parse(res);
   assert.isObject(obj);
   assert.equal(obj.responseHeader.status,0);  
}
