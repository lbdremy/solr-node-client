// Testing support http://wiki.apache.org/solr/TermsComponent

// Add this setting options to solrconfig.xml
/*

<searchComponent name="terms" class="solr.TermsComponent"/>

<!-- A request handler for demonstrating the spellcheck component.

  NOTE: This is purely as an example.  The whole purpose of the
SpellCheckComponent is to hook it into the request handler that
handles your normal user queries so that a separate request is
not needed to get suggestions.

  IN OTHER WORDS, THERE IS REALLY GOOD CHANCE THE SETUP BELOW IS
NOT WHAT YOU WANT FOR YOUR PRODUCTION SYSTEM!

  See http://wiki.apache.org/solr/SpellCheckComponent for details
  on the request parameters.
-->

  <!-- A request handler for demonstrating the terms component -->
<requestHandler name="/terms" class="solr.SearchHandler" startup="lazy">
<lst name="defaults">
<bool name="terms">true</bool>
<bool name="distrib">false</bool>
</lst>
<arr name="components">
<str>terms</str>
</arr>
</requestHandler>
*/


/**
 * Modules dependencies
 */

var mocha = require('mocha'),
  figc = require('figc'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require( libPath + '/solr'),
  sassert = require('./sassert');

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");


describe('Client#createQuery',function(){
  describe('#terms(options), callback)',function(){
    it('should create a Terms query',function(done){
      var options = {
        "on": true
        ,	"fl": 'title'
        ,	"prefix": 's'
        , "mincount": 1
        , "maxcount": 10
        , "limit": 2
        , "sort": 'index'
      };

      var query = client.createQuery()
        .terms(options)
        .debugQuery();

      client.terms(query, function(err, data){
        console.log(data);
        sassert.ok(err, data);
        assert.deepEqual(data.terms,
          {
            title:
              [
                'smoke',
                1,
                'sunrise',
                1
              ]
          });
        done();
      });
    });
  });
});
