// Testing support http://wiki.apache.org/solr/MoreLikeThis
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
	describe('#mlt(options), callback)',function(){
		it('should create a MoreLikeThis query',function(done){
			var options = {
								"on": true
							,	"fl": ['content', 'title']
							,	"count": 15
							,	"mintf": 0
							,	"mindf": 0
							,	"minwl": 0
							,	"maxwl": 1500
							,	"maxqt": 1500
							,	"maxntp": 1500
							,	"boost": true
							,	"qf": 1
						};

			var query = client.createQuery()
				.mlt(options)
				.q({'title_t': 'test'})
				.debugQuery();

			client.search(query, function(err, data){
				sassert.ok(err, data);
				assert.deepEqual(data.responseHeader.params, 
						{ 	'mlt.minwl': '0',
					        'mlt.fl': 'content,title',
					        'mlt.boost': 'true',
					        'mlt.mintf': '0',
					        'mlt.qf': '1',
					        mlt: 'true',
					        'mlt.maxwl': '1500',
					        'mlt.maxntp': '1500',
					        'mlt.maxqt': '1500',
					        wt: 'json',
					        'mlt.mindf': '0',
					        'mlt.count': '15',
 					        "debugQuery": "true",
					        q: "title_t:test"
					    });
				done();
			});
		});
	});
});
