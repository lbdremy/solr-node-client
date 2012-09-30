// Dependencies 
var vows = require('vows'),
    assert = require('assert'),
    format = require('./../lib/utils/format');

// Suite Test

var suite = vows.describe('Support escaping special characters');

suite.addBatch({
   'All special characters that are part of the query syntax' : {
      topic : function() {
      	var string = '+ - && || ! ( ) { } [ ] ^ " ~ * ? : \\';
        return format.escapeSpecialChars(string);
      },
      'should be escape properly' : function(string){
        assert.equal(string,'\\+ \\- \\&\\& \\|\\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\\\');
      }
   }
}).export(module);
