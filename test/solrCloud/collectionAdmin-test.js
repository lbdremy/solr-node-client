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
                it('should create one new Collection, one shard, one replicas',function(done){
			this.timeout(10000);
                        var collection = client.collection();
                        collection.create(
                                {
                                        name: 'solrCollectionTest2',
                                        routerName: 'compositeId',
                                        numShards: 1,
					shards: 'shard1',
					replicationFactor: 1
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

	describe('#addReplica',function(){
                it('should add replica to shard2 of solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.addReplica({
                                collection:'solrCollectionTest2',
                                shard: 'shard1'
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#deleteReplica',function(){
                it('should delete replica core_node2 from shard1 from solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.deleteReplica({
				collection:'solrCollectionTest2',
				shard: 'shard1',
				replica: 'core_node2',
				onlyIfDown: 'false'
			});
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#clusterProp',function(){
                it('should set autoAddReplicas to true',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.clusterProp({
                                name:'autoAddReplicas',
                                val: 'true',
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
		it('should unset autoAddReplicas',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.clusterProp({
                                name:'autoAddReplicas',
                                val: null
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

        describe('#migrate',function(){
                it('should migrate documents from solrCollectionTest2 to solrCollectionTest1',function(done){
                        this.timeout(20000);
                        var collection = client.collection();
                        collection.migrate({
                                collection:'solrCollectionTest2',
                                targetCollection: 'solrCollectionTest1',
				splitKey: 'A!'
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });     
        });

//test for ADDROLE and REMOVEROLE should go here, after we have defined a config file for solrCloud

	describe('#overseerStatus',function(){
                it('should return information with status OK',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.overseerStatus();
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#clusterStatus',function(){
                it('should return information with status OK',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.clusterStatus();
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#list',function(){
                it('should return information with status OK',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.list();
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#addReplicaProp',function(){
                it('should add preferredLeader property to replica core_node1 on collection solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.addReplicaProp({
				collection:'solrCollectionTest2',
				shard: 'shard1',
				replica: 'core_node1',
				property: 'preferredLeader',
				propertyValue: 'true',
				shardUnique: 'true'
			});
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

        describe('#deleteReplicaProp',function(){
                it('should delete preferredLeader property on replica core_node1 on collection solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.deleteReplicaProp({
                                collection:'solrCollectionTest2',
                                shard: 'shard1',
                                replica: 'core_node1',
                                property: 'preferredLeader',
                                sharedUnique: 'true'
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

	describe('#balanceShardUnique',function(){
                it('should balance the property on collection solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.balanceShardUnique({
                                collection:'solrCollectionTest2',
                                property: 'preferredLeader',
                                shardUnique: 'true'
                        });
                        client.executeCollection(collection,function(err,data){
                                //sassert.ok(err,data);
                                assert.equal(data.responseHeader.status,0);
                                done();
                        });
                });
        });

        describe('#rebalanceLeaders',function(){
                it('should balance leaders on a collection',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.rebalanceLeaders({
                                collection:'solrCollectionTest2',
                                maxAtOnce: 100,
                                maxWaitSeconds: 60
                        });
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
/*
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
*/
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
