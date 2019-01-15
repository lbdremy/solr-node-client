//Testing support http://wiki.apache.org/solr/FieldCollapsing?highlight=%28field%29%7C%28collapsing%29
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

	describe('.rangeFilter(array)',function(){
		it('should filter a query using an array of multiple fields',function(done){
			var query = client.createQuery()
				.q('test')
				.rangeFilter([{field: "id", start: 100, end: 200},
					{field: "id", start: 300, end: 400}])
				.debugQuery();
			client.search(query, function(err, data){
				sassert.ok(err, data);
				assert.equal('(id:[100 TO 200] AND id:[300 TO 400])', data.responseHeader.params.fq);
				done();
			});
		});
	});

	describe('.rangeFilter(start, end)',function(){
		it('should filter a query using a range',function(done){
			var query = client.createQuery()
				.q('test')
				.rangeFilter({field: 'id', start: 100, end: 200});

			client.search(query, function(err, data){
				sassert.ok(err, data);
				assert.equal('id:[100 TO 200]', data.responseHeader.params.fq);
				done();
			});
		});
	});
});
