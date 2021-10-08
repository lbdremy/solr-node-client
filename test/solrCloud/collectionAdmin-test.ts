import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../../lib/solr';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

//TO-DO: add test for collectionConfigName, routerField, async, createNodeSet, createNodeSetShuffle
describe('Collection', function () {
  describe('#createCollection', function () {
    it('should create one new Collection', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.create({
        name: 'solrCollectionTest1',
        numShards: 2,
        replicationFactor: 1,
        maxShardsPerNode: 1,
        autoAddReplicas: false,
      });
      const response = await client.executeCollection(collection);
      assert.equal(response.responseHeader.status, 0);
    });

    it('should create one new Collection, one shard, one replicas', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.create({
        name: 'solrCollectionTest2',
        routerName: 'compositeId',
        numShards: 1,
        shards: 'shard1',
        replicationFactor: 1,
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });

    it('should create one new Collection, with implicit router', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.create({
        name: 'solrCollectionTest3',
        routerName: 'implicit',
        shards: ['shard1', 'shard2'],
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#reloadCollection', function () {
    it('should reload collection solrCollectionTest1', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.reload('solrCollectionTest1');
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#splitShard', function () {
    //params `ranges, splitKey not included
    it('should split shard shard1 in solrCollectionTest1', async function () {
      this.timeout(20000);
      const collection = client.collection();
      collection.splitShard({
        collection: 'solrCollectionTest1',
        shard: 'shard1',
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#deleteShard', function () {
    it('should delete shard shard1 in collection solrCollectionTest3', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.deleteShard({
        collection: 'solrCollectionTest3',
        shard: 'shard1',
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#createShard', function () {
    it('should create shard shardtest1 in collection solrCollectionTest3', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.createShard({
        collection: 'solrCollectionTest3',
        shard: 'shard1',
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#createAlias', function () {
    it('should create alias testAlias for collections solrCollectionTest1, solrCollectionTest2', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.createAlias({
        name: 'testAlias',
        collections: ['solrCollectionTest1', 'solrCollectionTest2'],
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#deleteAlias', function () {
    it('should delete alias testAlias', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.deleteAlias('testAlias');
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#addReplica', function () {
    it('should add replica to shard2 of solrCollectionTest2', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.addReplica({
        collection: 'solrCollectionTest2',
        shard: 'shard1',
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });

  describe('#deleteReplica', function () {
    it('should delete replica core_node2 from shard1 from solrCollectionTest2', async function () {
      this.timeout(10000);
      const collection = client.collection();
      collection.deleteReplica({
        collection: 'solrCollectionTest2',
        shard: 'shard1',
        replica: 'core_node2',
        onlyIfDown: false,
      });
      const data = await client.executeCollection(collection);
      assert.equal(data.responseHeader.status, 0);
    });
  });
});

describe('#clusterProp', function () {
  it('should set autoAddReplicas to true', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.clusterProp({
      name: 'autoAddReplicas',
      val: true,
    });
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});
it('should unset autoAddReplicas', async function () {
  this.timeout(10000);
  const collection = client.collection();
  collection.clusterProp({
    name: 'autoAddReplicas',
  });
  const data = await client.executeCollection(collection);
  assert.equal(data.responseHeader.status, 0);
});

describe('#migrate', function () {
  it('should migrate documents from solrCollectionTest2 to solrCollectionTest1', async function () {
    this.timeout(20000);
    const collection = client.collection();
    collection.migrate({
      collection: 'solrCollectionTest2',
      targetCollection: 'solrCollectionTest1',
      splitKey: 'A!',
    });
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

//test for ADDROLE and REMOVEROLE should go here, after we have defined a config file for solrCloud

describe('#overseerStatus', function () {
  it('should return information with status OK', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.overseerStatus();
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

describe('#clusterStatus', function () {
  it('should return information with status OK', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.clusterStatus();
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

describe('#list', function () {
  it('should return information with status OK', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.list();
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

describe('#addReplicaProp', function () {
  it('should add preferredLeader property to replica core_node1 on collection solrCollectionTest2', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.addReplicaProp({
      collection: 'solrCollectionTest2',
      shard: 'shard1',
      replica: 'core_node1',
      property: 'preferredLeader',
      propertyValue: true,
      shardUnique: true,
    });
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

describe('#deleteReplicaProp', function () {
  it('should delete preferredLeader property on replica core_node1 on collection solrCollectionTest2', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.deleteReplicaProp({
      collection: 'solrCollectionTest2',
      shard: 'shard1',
      replica: 'core_node1',
      property: 'preferredLeader',
    });
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

describe('#balanceShardUnique', function () {
  it('should balance the property on collection solrCollectionTest2', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.balanceShardUnique({
      collection: 'solrCollectionTest2',
      property: 'preferredLeader',
      shardUnique: true,
    });
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

describe('#rebalanceLeaders', function () {
  it('should balance leaders on a collection', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.rebalanceLeaders({
      collection: 'solrCollectionTest2',
      maxAtOnce: 100,
      maxWaitSeconds: 60,
    });
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
});

describe('#deleteCollection', function () {
  it('should delete collection solrCollectionTest1', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.delete('solrCollectionTest1');
    const data = await client.executeCollection(collection);
    assert.equal(data.responseHeader.status, 0);
  });
  /*
		it('should delete collection solrCollectionTest2',function(done){
                        this.timeout(10000);
                        var collection = client.collection();
                        collection.delete('solrCollectionTest2');
                        client.executeCollection(collection,function(err,data){

                                assert.equal(data.responseHeader.status,0);

                        });
                });
*/
  it('should delete collection solrCollectionTest3', async function () {
    this.timeout(10000);
    const collection = client.collection();
    collection.delete('solrCollectionTest3');
    const response = await client.executeCollection(collection);
    assert.equal(response.responseHeader.status, 0);
  });
});
