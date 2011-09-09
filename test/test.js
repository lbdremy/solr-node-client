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
         'should return a `Client`' : function(client){
            assertClient(client);
         }
      },
      'with custom host, post, core and path' : {
         topic : function(){
            var host = 'localhost';
            var port = 8983;
            var core = '';
            var path = '/solr';
            var client = solr.createClient(host,port,core,path);
            return client
         },
         'should return a `Client`' : function(client){
            assertClient(client);
         }
      }
   }
}).addBatch({
   'Adding' : {
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
         'should be possible.' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'several documents to the Solr DB' : {
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
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      }
   }
}).addBatch({
   'Committing' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'manually' : {
         topic : function(client){
            client.autoCommit = false;
            client.commit(this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
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
   'Deleting' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'a document by ID' : {
         topic : function(client){
            client.deleteByID(1234567890,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'a document with a query' : {
         topic : function(client){
            client.delete('title_t' , 'Test title', this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'a range of documents' : {
         topic : function(client){
            var start = new Date();
            start.setDate(start.getDate() -5);
            var stop = new Date();
            stop.setDate(stop.getDate() - 4);
            client.deleteByRange('last_update',start,stop,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      }
   }
}).addBatch({
   'Optimizing' : {
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
         'should be possible' : function(err,res){
            
         }
      }
   }
}).addBatch({
   'Updating' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'the Solr Database with any object' : {
         topic : function(client){
            var data = { rollback : {} };
            client.update(data,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      } 
   }
}).addBatch({
   'Rolling back' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'all documents added or deleted to the index since the last commit' : {
         topic : function(client){
            client.rollback(this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      }
   }
}).addBatch({
   'Make a query' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'that will be handle by DisMaxParserPlugin' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 0.2 , description : 3.3}).mm(2).start(0).rows(10);
            client.query(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that will be handle by DefaultRequestHandler' : {
         topic : function(client){
            var query = client.createQuery().q({title : 'laptop'}).start(0).rows(10);
            client.query(query,this.callback);
         },
         'should be possible' : function(err,res) {
            assertCorrectResponse(err,res);
         }
      },
      'that return a sorted result in ascending or descending order' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).sort({score: 'desc',price: 'asc'});
            client.query(query,this.callback);
         },
         'should be possible': function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return a result where one or more fields are on a range of values' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).rangeFilter([{field: 'price', start : '10',end : '100' },{field: 'delievery_t', start : '10',end : '100' } ]);
            client.query(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return a result where one or more fields match a particular value'  : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).matchFilter('category','Electronics');
            client.query(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return only a set of fields specified' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).restrict(['title','description']);
            client.query(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return a result within an expected timeout' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).timeout(1000);
            client.query(query,this.callback); 
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that autoconvert JS Date Object into a properly date format expected by Solr' : {
         topic : function(client){
            var start = new Date();
            start.setDate(start.getDate() -1);
            var stop = new Date();
            stop.setDate(stop.getDate());
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).rangeFilter([{field: 'last_update', start : start,end : stop },{field: 'price', start : '10',end : '100' } ]);
            console.log(query);
            client.query(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
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

function assertCorrectResponse(err,res){
   assert.isNull(err);
   var obj = JSON.parse(res);
   assert.isObject(obj);
   assert.equal(obj.responseHeader.status,0);
   
}
