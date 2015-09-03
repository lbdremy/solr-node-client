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

//TO-DO: add test for collectionConfigName, routerField, async, createNodeSet, createNodeSetShuffle
describe('Collection',function(){
	describe('#createCollection',function(){
		it('should create one new Collection',function(done){
			var collection = client.collection();
			collection.create(
				{
					name: 'solrCollectionTest',
					routerName: 'compositeId',
					numShards: 1,
					shards: 'shardName',
					replicationFactor: 1,
					maxShardsPerNode: 1,
					createNodeSet: config.client.host + '/' + config.client.port,
					autoAddReplicas: 'false'
				}
			);
			client.executeCollection(collection,function(err,data){
				sassert.ok(err,data);
				done();
			});
		});
                it('should create one new Collection, two shards, with array of shard names',function(done){
                        var collection = client.collection();
                        collection.create(
                                {
                                        name: 'solrCollectionTest',
                                        routerName: 'compositeId',
                                        numShards: 2,
                                        shards: {'shardName1','shardName2'}
                                }
                        );
                        client.executeCollection(collection,function(err,data){
                                sassert.ok(err,data);
                                done();
                        });
                });
                it('should create one new Collection, with arrays where possible',function(done){
                        var collection = client.collection();
                        collection.create(
                                {
                                        name: 'solrCollectionTest',
                                        routerName: 'compositeId',
                                        numShards: 2,
                                        shards: {'shardName1','shardName2'}
                                }
                        );
                        client.executeCollection(collection,function(err,data){
                                sassert.ok(err,data);
                                done();
                        });
                });
        });
});
