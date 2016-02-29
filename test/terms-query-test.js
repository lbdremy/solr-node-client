// Testing support http://wiki.apache.org/solr/TermsComponent
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
    it('should create a Terms query and termsSearch',function(done){
      var options = {
            "on": true
          , "fl": 'title'
          , "prefix": 's'
          , "mincount": 1
          , "maxcount": 10
          , "limit": 5
          , "sort": 'index'
        };

      var query = client.createQuery()
        .terms(options)
        .debugQuery();

      client.termsSearch(query, function(err, data){
        sassert.ok(err,data);
        assert.isObject(data.terms);
        done();
      });
    });
  });
});
