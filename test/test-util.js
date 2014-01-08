// Dependencies
var format = require('../lib/utils/format');
   vows = require('vows'),
   assert = require('assert');

//nock.recorder.rec();

// Suite Test

var suite = vows.describe('Solr Client Utilities');

suite.addBatch({
   'format' : {
      'dateISOify()' : {
         'when an array is used' : {
            topic : function() {
               return format.dateISOify([
                  {
                     id:    1,
                     date1: new Date()
                  },
                  {
                     id:    2,
                     date1: new Date()
                  }
               ]);
            },
            'it should replace all nested date objects with strings' : function(list) {
               assert.equal(typeof list[0].date1, "string");
               assert.equal(typeof list[1].date1, "string");
            }
         },
         'when an object is used' : {
            topic : function() {
               return format.dateISOify({
                  id:    1,
                  date1: new Date()
               });
            },
            'it should replace all nested date objects with strings' : function(doc) {
               assert.equal(typeof doc.date1, "string");
            }
         },
         'when a date object itself is used' : {
            topic : function() {
               return format.dateISOify(new Date());
            },
            'it should return a string' : function (date) {
               assert.equal(typeof date, "string");
            }
         }
      },
      'toISOString()' : {
         'when invalid date objects are found' : {
            topic : function() {
               return format.toISOString(new Date("0000-00-00"));
            },
            'it should be replaced by null' : function(date){
               assert.strictEqual(date, null);
            }
         }
      }
   }
}).export(module);
