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
   mocks.facet(nock);
   mocks.facetMultiple(nock);
}

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
            client.search(query,this.callback);
         },
         'should return a correct response without error' :function(err,res) {
            assertCorrectResponse(err,res)
         }
      },
      'with the same options and multiple fields' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery()
                           .q({'*' : '*'})
                           .rows(0)
                           .facet({
                              field : ['title', 'description'],
                              prefix : 'Ipa',
                              query : 'title:Ipad',
                              limit : 20,
                              offset : 0,
                              sort : 'count',
                              mincount : 0,
                              missing : false,
                              method : 'fc' ,
                           }); 
            client.search(query,this.callback);
         },
         'should return a correct response without error' :function(err,res) {
            assertCorrectResponse(err,res)
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
