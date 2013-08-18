// Dependencies
var nock = require('nock'),
   solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert'),
   mocks = require('./mocks'),
   fs = require('fs');

// Load configuration file
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

if(config.mocked){
   //nock.recorder.rec();
   mocks.group(nock);
   mocks.groupMultiple(nock);
}

// Suite Test

var suite = vows.describe('Solr Client API: group command');

suite.addBatch({
   'Grouping Result' : {
      'with a field' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery().q({ description : 'laptop'}).groupBy('title') ;
            client.search(query,this.callback);
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
            client.search(query,this.callback);
         },
         'should be possible' :function(err,res) {
            assertCorrectResponse(err,res)
         }
      },
      'with the same options and multiple fields' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery().q({description : 'laptop'}).group({
               field : ['title', 'description'],
               limit : 20,
               offset : 0,
               sort : 'score asc',
               format : 'grouped',
               main : false,
               ngroups : true,
               truncate : false,
               cache : 0
            });
            client.search(query,this.callback);
         },
         'should be possible' :function(err,res){
            assertCorrectResponse(err,res);
         }
      }
   }
}).export(module);

// Macro

function assertCorrectResponse(err,data){
   assert.isNull(err);
   assert.isObject(data);
   assert.equal(data.responseHeader.status,0);
}
