// Dependencies 
var nock = require('nock'), 
   solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert'),
   fs = require('fs'),
   mocks = require('./mocks');

// Load configuration file
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

if(config.mocked){
   //nock.recorder.rec();
   mocks.deleteByRange(nock);
}

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
var today = new Date('2012-05-07T21:50:08.309Z');
var yesterday = new Date('2012-05-06T21:50:08.309Z');
var beforeYesterday = new Date('2012-05-05T21:50:08.309Z');
            
suite.addBatch({
   'Add 20 documents' : {
      'with fields last_update_dt and title_t' : {
         topic : function(){
            var client = solr.createClient();
            client.autoCommit = true;
            var date = today;
            var docs = new Array(20);
            for( var i = 0; i < 20 ; i++){
               if( i >= 10){
                  date = beforeYesterday;
               }
               docs[i] = {
                  id : i,
                  title_t : 'test',
                  last_update_dt : date
               }
            }
            client.add(docs,this.callback);
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
            client.search(query,this.callback);
         },
         'should find 10 documents' : function(err,data){
            assert.isNull(err);
            assert.equal(data.response.numFound,10);
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
