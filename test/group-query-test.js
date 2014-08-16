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

	describe('.groupBy(field), callback)',function(){
		it('should create a group by query',function(done){
			var query = client.createQuery()
				.q('test')
				.groupBy('title_t')
				.debugQuery();
			client.search(query, function(err, data){
				sassert.ok(err, data);
				assert(data.responseHeader.params.group);
				assert.equal('title_t', data.responseHeader.params['group.field']);
				done();
			});
		});
	});

	describe('#group(options), callback)',function(){
		it('should create a group query',function(done){
			var options = {
								"on": true
							,	"field": "title_t"
							, 	"func": "test"
							,	"rows": 11
							,	"start": 1
							,	"limit": 15
							,	"offset": 8
							,	"sort": "score desc"
							,	"format": "simple"
							,	"main":	true
							,	"ngroups": true
							,	"truncate": true
							,	"facet": true
							,	"cache": 50
						};

			var query = client.createQuery()
				.group(options);

			client.search(query, function(err, data){
				sassert.ok(err, data);
				assert.deepEqual(data.responseHeader.params, 
						{'group.format':'simple','group.ngroups':'true','group.limit':'15','group.truncate':'true',
						'group.field':'title_t','group.main':'true',group:'true','group.sort':'score desc',
						'group.cache.percent':'50','group.offset':'8',wt:'json'});
				done();
			});
		});
	});
});
