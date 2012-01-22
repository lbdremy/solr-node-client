// Dependencies 
var solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert');

// Suite Test

var suite = vows.describe('Solr Client API: group command');

suite.addBatch({
   'Grouping Result' : {
      'with a field' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery().q({ description : 'laptop'}).groupBy('title') ;
            client.query(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'with all availables options: field, limit,offset,sort,format,main,ngroups,truncate,cache' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery().q({description : 'laptop'}).group({
               field : 'title',
               limit : 20,
               offset : 0,
               sort : 'score asc',
               format : 'grouped',
               main : false,
               ngroups : true,
               truncate : false,
               cache : 0
            }); 
            client.query(query,this.callback);
         },
         'should be possible' :function(err,res) {
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
