// Dependencies 
var nock = require('nock'), 
   solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert');
   mocks = require('./mocks'),
   fs = require('fs');

// Load configuration file
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

if(config.mocked){
   //nock.recorder.rec();
   mocks.mlt(nock);
}

// Suite Test

var suite = vows.describe('Solr Client API: More like this');

suite.addBatch({
   'Create a mlt' : {
      'with the following options: `fl`, `mindf`, `mintf`, `minwl`, `maxwl`, `maxqt`, `maxntp`, `boost`, `count`' : {
         topic : function(){
            var client = solr.createClient();
            var query = client.createQuery()
                           .q('laptop')
                           .mlt({
                              fl : ['title_t','description_t'],
                              mindf : 1,
                              mintf : 1,
                              minwl : 3,
                              maxwl : 5,
                              maxqt : 8,
                              maxntp : 9,
                              boost : true,
                              count : 10,
                              qf : { title_t : 2 , description_t : 3}
                           })
                           .fl('id,score');
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
   assert.isObject(data.moreLikeThis);
   assert.equal(data.responseHeader.params['mlt.fl'],'title_t,description_t');
   assert.equal(data.responseHeader.params['mlt.mintf'],'1');
   assert.equal(data.responseHeader.params['mlt.mindf'],'1');
   assert.equal(data.responseHeader.params['mlt.minwl'],'3');
   assert.equal(data.responseHeader.params['mlt.maxwl'],'5');
   assert.equal(data.responseHeader.params['mlt.maxqt'],'8');
   assert.equal(data.responseHeader.params['mlt.maxntp'],'9');
   assert.equal(data.responseHeader.params['mlt.boost'],'true');
   assert.equal(data.responseHeader.params['mlt.qf'],'title_t^2 description_t^3');
   assert.equal(data.responseHeader.params['mlt'],'true');
   assert.equal(data.responseHeader.params['mlt.count'],'10'); 
}
