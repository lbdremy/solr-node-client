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
			this.timeout(10000);
			var collection = client.collection();
			collection.create(
				{
					name: 'solrCollectionTest1',
					numShards: 2,
					replicationFactor: 1,
					maxShardsPerNode: 1,
					//createNodeSet: config.client.host + '/' + config.client.port,
					autoAddReplicas: 'false'
				}
			);
			client.executeCollection(collection,function(err,data){
				//sassert.ok(err,data);
				assert.equal(data.responseHeader.status,0);
				done();
			});
		});
                it('should create one new Collection, two shards, with array of shard names',function(done){
			this.timeout(10000);
                        var collection = client.collection();
                        collection.create(
                                {
                                        name: 'solrCollectionTest2',
                                        routerName: 'compositeId',
                                        numShards: 2
                                }
                        );
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
				assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
                it('should create one new Collection, with implicit router',function(done){
			this.timeout(10000);
                        var collection = client.collection();
                        collection.create(
                                {
                                        name: 'solrCollectionTest3',
                                        routerName: 'implicit',
                                        shards: ['shard1','shard2']
                                }
                        );
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
				assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });
	describe('#deleteCollection',function(){
                it('should delete collection solrCollectionTest1',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.delete('solrCollectionTest1');
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
		it('should delete collection solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.delete('solrCollectionTest2');
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
		it('should delete collection solrCollectionTest3',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.delete('solrCollectionTest3');
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });

	});

});
