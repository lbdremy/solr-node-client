// Testing support for arbitrary handler-paths configured on solr
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

describe('Client',function(){
	describe('Arbitrary HandlePath Support',function(){
		it('should add documents over the arbitrary handlePost',function(done){
			var docs = [
				{
					id : 4,
					title_t : 'title4'
				},
				{
					id : 5,
					title_t : 'title5'
				}
			];
			var request = client.handlePost(client.UPDATE_JSON_HANDLER,docs,function(err,data){
				assert.equal(request.path, basePath + '/update/json?&wt=json');
				sassert.ok(err,data);
				done();
			});
		});
    
		it('should find documents over the generic handleGet',function(done){
			var request = client.handleGet(client.SELECT_HANDLER,'q=*:*',function(err,data){
				assert.equal(request.path, basePath + '/select?q=*:*&wt=json');
				sassert.ok(err,data);
				assert.deepEqual({ q : '*:*' , wt: 'json' },data.responseHeader.params);
				done();
			});
		});
  });
});
