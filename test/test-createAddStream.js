// Dependencies
var nock = require('nock'),
   solr = require('./../main'),
   vows = require('vows'),
   assert = require('assert'),
   fs = require('fs'),
   mocks = require('./mocks'),
   JSONStream = require('JSONStream'),
   EventEmitter = require('events').EventEmitter;

// Load configuration file
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

/*
if(config.mocked){
   //nock.recorder.rec();
   mocks.createAddStream(nock);
}
*/

if(!config.mocked){

   // Suite Test

   var suite = vows.describe('Solr Client API: createAddStream');

   suite.addBatch({
      'Adding documents through a stream' : {
         topic : function(){
            var promise = new EventEmitter();
            var client = solr.createClient();
            client.autoCommit = true;
            var addStream = client.createAddStream();
            var data = '';
            addStream
               .on('end',function(){
                  promise.emit('success',JSON.parse(data));
               })
               .on('data',function(buffer,encoding){
                  data += buffer.toString(encoding);
               })
               .on('error',function(err){
                  promise.emit('error',err);
               });
            var n = 50;
            for(var i = 0; i < n; i++){
               addStream.write({ id : i , title_t : 'title' + i, test_b : true});
            }
            addStream.end();
            return promise;
         },
         'should works' : function(err,data){
            assert.equal(data.responseHeader.status,0);
            assert.isNull(err);
         }
      }
   }).export(module);

}