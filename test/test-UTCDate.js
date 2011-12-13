// Dependencies 
var vows = require('vows'),
    assert = require('assert');

// Suite Test

var suite = vows.describe('Solr Date');

suite.addBatch({
   'Date submitted by the user being based on Local time.' : {
      topic : function() {
         return (new Date('Fri Oct 07 2011 18:24:00 GMT+0200 (CEST)')).toISOString();
      },
      'should return a Date following this pattern 1995-12-31T23:59:59.999Z and based on UTC time' : function(date){
        assert.equal(date,'2011-10-07T16:24:00.000Z');
      }
   }
}).export(module);
