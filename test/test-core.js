// Dependencies
var nock = require('nock'),
   solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert'),
   SolrError = require('./../lib/error/solr-error'),
   mocks = require('./mocks')
   fs = require('fs');

// Load configuration file
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

if(config.mocked){
   mocks.core(nock);
}
//nock.recorder.rec();

// Suite Test

var suite = vows.describe('Solr Client API Core');

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
      'with custom options' : {
         topic : function(){
            var client = solr.createClient({
                host: 'localhost',
                port: 8983,
                core: '',
                path: '/solr'
            });
            return client;
         },
         'should return a `Client`' : function(client){
            assertClient(client);
            assert.equal(client.options.host,'localhost');
            assert.equal(client.options.port,8983);
            assert.equal(client.options.core,'');
            assert.equal(client.options.path,'/solr');
         }
      },
      'with custom host' : {
         topic : function(){
            var host = 'localhost';
            var client = solr.createClient(host);
            return client
         },
         'should return a `Client`' : function(client){
            assertClient(client);
            assert.equal(client.options.host,'localhost');
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
      'one document using unknown fields' : {
         topic : function(client){
            var doc = {
               id : 1234567810,
               unknownfield1 : 'Test title',
            };
            client.add(doc,this.callback);
         },
         'should return an SolrError' : function(err,res){
            assertSolrError(err,res);
         }
      },
      'a list of documents' : {
         topic : function(client){
            client.updateEach = 1; // default value when a client is created
            var docs = [
               { id : 1 , title_t : 'Hello'},
               { id : 3 , title_t : 'Hola'},
               { id : 5 , title_t : 'Bonjour'}
            ];
            client.add(docs,this.callback);
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
      'a document where a field matchs a value' : {
         topic : function(client){
            client.delete('title_t' , 'Test title', this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'documents matching a query' : {
         topic : function(client){
            var query = 'title_t:Test title';
            client.deleteByQuery(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'a range of documents' : {
         topic : function(client){
            var start = new Date('2012-05-01T21:50:08.309Z');
            var stop = new Date('2012-05-02T21:50:08.310Z');
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
            assertCorrectResponse(err,res);
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
   'Ping the Solr server' : {
      topic : function(){
         var client = solr.createClient();
         client.ping(this.callback);
      },
      'should be possible' : function(err,res){
         assertCorrectResponse(err,res);
      }
   }
}).addBatch({
   'Make a query' : {
      topic : function(){
         var client = solr.createClient();
         return client;
      },
      'using unknown fields' : {
         topic : function(client){
            var query = client.createQuery().q({titl : 'laptop'}).start(0).rows(10);
            client.search(query,this.callback);
         },
         'should return an SolrError' : function(err,res){
            assertSolrError(err,res);
         }
      },
      'that will be handle by DisMaxParserPlugin' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 0.2 , description : 3.3}).mm(2).start(0).rows(10);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that will be handle by EDisMaxParserPlugin' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').edismax().qf({title : 0.2 , description : 3.3}).mm(2).start(0).rows(10);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that will be handle by DefaultRequestHandler' : {
         topic : function(client){
            var query = client.createQuery().q({title : 'laptop'}).start(0).rows(10);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res) {
            assertCorrectResponse(err,res);
         }
      },
      'that will be handle by the RequestHandler given in parameter' : {
         topic : function(client){
            var query = client.createQuery().q({title : 'laptop'}).requestHandler('custom').start(0).rows(10);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return a sorted result in ascending or descending order' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).sort({score: 'desc',price: 'asc'});
            client.search(query,this.callback);
         },
         'should be possible': function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return a result where one or more fields are on a range of values' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).rangeFilter([{field: 'price', start : '10',end : '100' },{field: 'delievery_t', start : '10',end : '100' } ]);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return a result where one or more fields match a particular value'  : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).matchFilter('category','Electronics');
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return only a set of fields specified' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).restrict(['title','description']);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that return a result within an expected timeout' : {
         topic : function(client){
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).timeout(1000);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that autoconvert JS Date Object into a properly date format expected by Solr' : {
         topic : function(client){
            var start = new Date('2012-05-05T21:50:08.783Z');
            var stop = new Date('2012-05-06T21:50:08.783Z');
            var query = client.createQuery().q('laptop').dismax().qf({title : 2 , description : 3}).start(0).rows(10).rangeFilter([{field: 'last_update', start : start,end : stop },{field: 'price', start : '10',end : '100' } ]);
            client.search(query,this.callback);
         },
         'should be possible' : function(err,res){
            assertCorrectResponse(err,res);
         }
      },
      'that use custom parameter in the query thanks to the set method' : {
         topic : function(client){
            var query = client.createQuery();
            query.q('laptop')
                 .dismax()
                 .set('fl=description,score')
                 .set(encodeURIComponent('fq={!q.op=OR%20df=merchant_id_t}837338%208373873%2038738'));
            client.search(query,this.callback);
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
    assert.isFunction(client.commit);
    assert.isFunction(client.delete);
    assert.isFunction(client.deleteByID);
    assert.isFunction(client.optimize);
    assert.isFunction(client.update);
    assert.isFunction(client.search);
}

function assertCorrectResponse(err,data){
   assert.isNull(err);
   assert.isObject(data);
   assert.equal(data.responseHeader.status,0);
}

function assertSolrError(err,res){
   assert.instanceOf(err,SolrError);
   assert.equal(err.name,'SolrError');
   assert.match(err.message,/^HTTP status [0-9]{3}\.Reason:[\s\S]+/)
   assert.isNull(res);
}
