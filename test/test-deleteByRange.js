// Dependencies 
var solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert');
   
// Suite Test

/**
 * Check that the deleteByRange command works with range of date
 * 
 * Description of test:
 * - Add 20 documents to the solr database with `last_update_dt` = new Date() - 2 days for 10 documents 
 * and for last 10 documents `last_update_dt` = new Date(). All documents have the field `title_t` === 'test'
 * - Delete all document between yesterday and now
 * - Commit deletion
 * - Query to find how many documents are in the database with `title_t` === 'test'
 */


var suite = vows.describe('Solr Client API: deleteByRange command');

// Dates
var today = new Date();
var yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
var beforeYesterday = new Date();
beforeYesterday.setDate(today.getDate() - 2);
            
suite.addBatch({
   'Add 20 documents' : {
      'with fields last_update_dt and title_t' : {
         topic : function(){
            var client = solr.createClient();
            client.autoCommit = true;
            client.updateEach = 20;
            var date = today;
            for( var i = 0; i < 20 ; i++){
               if( i >= 10){
                  date = beforeYesterday;
               }
               var data = {
                  id : i,
                  title_t : 'test',
                  last_update_dt : date
               }
               client.add(data,this.callback);
            }
         },
         'should works' : function(err,res){
            assertCorrectResponse(err,res);
         }
      }
   }
}).addBatch({
   'Delete documents' : {
      'between yesterday and today' : {
         topic : function(){
            var client = solr.createClient();
            client.deleteByRange('last_update_dt',yesterday,today,this.callback);
         },
         'should works' : function(err,res){
            assertCorrectResponse(err,res);
         }
      }
   }
}).addBatch({
   'Commit change' : {
      'to see effect of the deleteByRange command' : {
         topic : function(){
            var client = solr.createClient();
            client.commit(this.callback);
         },
         'should works' : function(err,res){
            assertCorrectResponse(err,res);
         }
      }
   }
}).addBatch({
   'Query all documents' : {
      'where title_t === `test`' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery().q({title_t : 'test'}).start(0).rows(10);
            client.query(query,this.callback);
         },
         'should find 10 documents' : function(err,res){
            assert.isNull(err);
            var obj = JSON.parse(res);
            assert.equal(obj.response.numFound,10);
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
