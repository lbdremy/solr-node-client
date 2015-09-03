/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	figc = require('figc'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../../lib-cov' : '../../lib',
	solr = require( libPath + '/solr'),
	sassert = require('../sassert');

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

        describe('#reloadCollection',function(){
                it('should reload collection solrCollectionTest1',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.reload('solrCollectionTest1');
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

        describe('#splitShard',function(){
		//params `ranges, splitKey not included
                it('should split shard shard1 in solrCollectionTest1',function(done){
                        this.timeout(20000);
                        var collection = client.collection();
                        collection.splitShard({
				collection: 'solrCollectionTest1',
				shard: 'shard1'
			});
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#deleteShard',function(){
                it('should delete shard shard1 in collection solrCollectionTest3',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.deleteShard({
                                collection:'solrCollectionTest3',
                                shard: 'shard1'
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });


        describe('#createShard',function(){
                it('should create shard shardtest1 in collection solrCollectionTest3',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.createShard({
				collection:'solrCollectionTest3',
				shard: 'shard1'
			});
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#createAlias',function(){
                it('should create alias testAlias for collections solrCollectionTest1, solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.createAlias({
                                name:'testAlias',
                                collections: ['solrCollectionTest1', 'solrCollectionTest2']
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#deleteAlias',function(){
                it('should delete alias testAlias',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.deleteAlias('testAlias');
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
