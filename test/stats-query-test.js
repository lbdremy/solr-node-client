// Testing support https://cwiki.apache.org/confluence/display/solr/The+Stats+Component
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
  describe('#stats(options), callback)',function(){
    it('should create a StatsComponent query and termsSearch',function(done){
      var options = {
            "field": "id"
          , "key": "id_key"
          , "min": true
          , "max": true
          , "sum": true
          , "count": true
          , "missing": true
          , "sumOfSquares": true
          , "mean": true
          , "stddev": true
          , "percentiles": [3,4.5,10,23,99]
        };

      var query = client.createQuery()
        .stats(options)
        .debugQuery();

      client.search(query, function(err, data){
        sassert.ok(err,data);
        assert.isObject(data.stats.stats_fields.id_key);
        done();
      });
    });
  });
});
