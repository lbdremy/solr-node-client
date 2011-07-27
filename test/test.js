// Dependencies 
var solr = require('./../lib/solr'),
   vows = require('vows'),
   assert = require('assert');

// Suite Test

var suite = vows.describe('Solr Client API');

suite.addBatch({
   'The creation of a Solr Client' : {
      'with no options' : {
         topic : function() {
            var client = solr.createClient();
            return client;
         },
         'should returned a Client' : function(client){
            assertClient(client);
         }
      },
      'with custom host,post,core and path' : {
         topic : function(){
            var host = 'localhost';
            var port = 8983;
            var core = '';
            var path = '/solr';
            var client = solr.createClient(host,port,core,path);
            return client
         },
         'should returned a Client' : function(client){
            assertClient(client);
         }
      }
   }
}).addBatch({
   'Add' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'one document to the Solr DB': {
         topic : function(client){
            var doc = { 
               id : 1234567890,
               title_t : 'Test title',
               description_t : 'Test Description' 
            };
            client.add(doc,this.callback);  
         },
         'should be possible.' : function(res,err){
            assertCorrectResponse(res,err);
         }
      },
      'several document to the Solr DB' : {
         topic : function(client){
            client.updateEach = 4;
            for(var i = 0; i < 5; i++){
               var doc = { 
                  id : 1234567891 + i,
                  title_t : 'Test title ' + i,
                  description_t : 'Test Description' + i 
               };
               client.add(doc,this.callback);
            }
            client.purgeAdd(this.callback);
         },
         'should be possible' : function(res,err){
            assertCorrectResponse(res,err);
         }
      }
   }
}).addBatch({
   'Commit' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'manually' : {
         topic : function(client){
            client.autoCommit = false;
            client.commit(this.callback);
         },
         'should be possible' : function(res,err){
            assertCorrectResponse(res,err);
         }
      },
      'automatically' : {
         topic : function(client){
            client.autoCommit = true;
            return client;
         },
         'should be possible' : function(client){
            assert.equal(client.autoCommit,true);
         }
      }
   }
}).addBatch({
   'Delete' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'a document by ID' : {
         topic : function(client){
            client.deleteByID(1234567890,this.callback);
         },
         'should be possible' : function(res,err){
            assertCorrectResponse(res,err);
         }
      },
      'a document with a query' : {
         topic : function(client){
            client.delete('title_t' , 'Test title', this.callback);
         },
         'should be possible' : function(res,err){
            assertCorrectResponse(res,err);
         }
      }
   }
}).addBatch({
   'Optimize' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'the Solr Database' : {
         topic : function(client){
            var options = {
               waitFlush: true ,
               waitSearcher: true
            };
            client.optimize(options,this.callback);
         },
         'should be possible' : function(res,err){
            
         }
      }
   }
}).addBatch({
   'Update' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'the Solr Database with any objects' : {
         topic : function(client){
            var data = { rollback : {} };
            client.update(data,this.callback);
         },
         'should be possible' : function(res,err){
            assertCorrectResponse(res,err);
         }
      } 
   }
}).addBatch({
   'Rollback' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'all adds/deletes documents made to the index since the last commit' : {
         topic : function(client){
            client.rollback(this.callback);
         },
         'should be possible' : function(res,err){
            assertCorrectResponse(res,err);
         }
      }
   }
}).addBatch({
   'Query' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'the Solr DB with a filter by field and text associated and with the number of row returned and the index of the first row' : {
         topic : function(client){
            client.query('title_t','tv',0,20,this.callback);
         },
         'should be possible' : function(res,err){
            assertCorrectResponse(res,err);
         }
      }
   }
}).export(module);

// Macros

function assertClient(client){
    assert.isFunction(client.add);
    assert.isFunction(client.purgeAdd);
    assert.isFunction(client.commit);
    assert.isFunction(client.delete);
    assert.isFunction(client.deleteByID);
    assert.isFunction(client.optimize);
    assert.isFunction(client.update);
    assert.isFunction(client.query);
}

function assertCorrectResponse(res,err){
   var obj = JSON.parse(res);
   assert.isObject(obj);
   assert.equal(obj.responseHeader.status,0);
   assert.isUndefined(err);
}
