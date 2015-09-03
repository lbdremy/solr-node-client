/**
 * Load dependencies
 */
var querystring = require('querystring'),
    format = require('./utils/format');

/**
 * Expose `Collection`
 */

module.exports = exports = Collection;

/**
 * Create a new `Collection`
 * @constructor
 *
 * @return {Collection}
 * @api private
 */

function Collection(){
  this.parameters = [];
}

/**
 * Set a new parameter
 * Since all possibilities provided by Solr are not available in the `Collection` object, `set()` is there to fill this gap.
 *
 * @param {String} parameter - string, special characters have to be correctly encoded or the request will fail.
 *
 * @return {Collection} - allow chaining
 * @api public
 */
Collection.prototype.set = function(parameter){
  var self = this;
  this.parameters.push(parameter);
  return self;
}

/**
 * Create a new Collection
 *
 * @param {Object} options - Set of options for creating a new collection
 * @param {String} name - The name of the collection to be created
 * @param {String} [routerName] - The router name that will be used. Default is 'compositeId'. 'implicit' is the only other valid option.
 * @param {Number} [numShards] - Number of shards to be created as part of the collection. Required when using 'compositeId' router.
 * @param {String|Array} [shards] - A comma separated list of shard names, or an array of shard names. Required if using 'implicit' router.
 * @param {Number} [replicationFactor] - The number of replicas to be created for each shard.
 * @param {Number} [maxShardsPerNode] - Sets a limit on the number of replicas CREATE will spread to each node.
 * @param {String|Array} [createNodeSet] - Defines the nodes to spread the shards/ replicas across. Comma separated list of node names, or an array of node names.
 * @param {Boolean} [createNodeSetShuffle] - Controls whether or not the shard-replicas created will be assigned to the nodes in createNodeSet in a sequential or shuffled order.
 * @param {String} [collectionConfigName] - Defines name of the configurations to use for this collection. Must already be stored in ZooKeeper.
 * @param {String} [routerField] - If specified, router will look at the value of the field in an input document to compute the hash and identify a shard instead of looking at the uniqueKey field.
 * @param {Boolean} [autoAddReplicas] - When set to true, enables auto addition of replicas on shared file systems.
 * @param {String} [async] - Request ID to track this action which will be processed asynchonously.

 * @return {Collection}
 * @api public
 */
Collection.prototype.create = function(options) {
  var self = this;
  this.parameters.push('action=CREATE');
  if(options.name){
    this.parameters.push('name=' + options.name);
  }
  if(options.routerName){
    this.parameters.push('router.name=' + options.routerName);
  }
  if(options.numShards !== undefined){
    this.parameters.push('numShards=' + options.numShards);
  }
  if(options.shards !== undefined){
    if( typeof(options.shards) === 'string') {
      this.parameters.push('shards=' + options.shards);
    }else{
      this.parameters.push('shards=' + options.shards.join());
    }
  }
  if(options.replicationFactor !== undefined){
    this.parameters.push('replicationFactor=' + options.replicationFactor);
  }
  if(options.maxShardsPerNode !== undefined){
    this.parameters.push('maxShardsPerNode=' + options.maxShardsPerNode);
  }
  if(options.createNodeSet !== undefined){
    if( typeof(options.createNodeSet) === 'string') {
      this.parameters.push('createNodeSet=' + options.createNodeSet);
    }else{
      this.parameters.push('createNodeSet=' + options.createNodeSet.join());
    }
  }
  if(options.createNodeSetShuffle !== undefined){
    this.parameters.push('createNodeSet.shuffle=' + options.createNodeSetShuffle);
  }
  if(options.collectionConfigName){
    this.parameters.push('collection.configName=' + options.collectionConfigName);
  }
  if(options.routerField){
    this.parameters.push('router.field=' + options.routerField);
  }
  if(options.autoAddReplicas !== undefined){
    this.parameters.push('autoAddReplicas=' + options.autoAddReplicas);
  }
  if(options.async){
    this.parameters.push('async=' + options.async);
  }

  return self;
}

/**
 * Reload a Collection
 * 
 * @param {String} name - Name of the Collection to be reloaded
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.reload = function(name) {
  var self = this;
  this.parameters.push('action=RELOAD');
  if(name){
    this.parameters.push('name=' + name);
  }

  return self;
}

/**
 * Split a shard
 * 
 * @param {Object} options - Options for splitting the shard
 * @param {String} collection - Name of the Collection that includes the shard to be split
 * @param {String} shard - Name of the shard to be split
 * @param {String|Array} [ranges] - Comma separated list of hash ranges in hexadecimal. If an array is supplied, it will be joined with commas.
 * @param {String} [splitKey] - The key to use for splitting the index
 * @param {String} [async] - Request ID to track this action, processed asynchonously.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.splitShard = function(options) {
  var self = this;
  this.parameters.push('action=SPLITSHARD');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.shard){
    this.parameters.push('shard=' + options.shard);
  }
  if(options.ranges !== undefined){
    if(typeof(ranges) === 'string'){
      this.parameters.push('ranges=' + options.ranges);
    }else{
      this.parameters.push('ranges=' + options.ranges.join());
    }
  }
  if(options.splitKey){
    this.parameters.push('split.key=' + options.splitKey);
  }
  if(options.async){
    this.parameters.push('async=' + options.async);
  }

  return self;
}

/**
 * Create a shard
 * Can only be used for collections that use the 'implicit' router. Use SPLITSHARD for the `compositId` router.
 * 
 * @param {Object} options - Options for creating the shard
 * @param {String} collection - Name of the Collection where the shard should be created
 * @param {String} shard - Name of the shard to be created
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.createShard = function(options) {
  var self = this;
  this.parameters.push('action=CREATESHARD');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.shard){
    this.parameters.push('shard=' + options.shard);
  }

  return self;
}

/**
 * Delete a shard
 * 
 * @param {Object} options - Options for deleting the shard
 * @param {String} collection - Name of the Collection that includes the shard to be deleted
 * @param {String} shard - Name of the shard to be deleted
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.deleteShard = function(options) {
  var self = this;
  this.parameters.push('action=DELETESHARD');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.shard){
    this.parameters.push('shard=' + options.shard);
  }

  return self;
}

/**
 * Create/ Modify alias for a collection
 * 
 * @param {Object} options - Options for creation of the collection alias.
 * @param {String} name - The alias name to be created.
 * @param {String|Array} collections - A comma separated list of collections to be aliased. If an array is provided, it will be joined by commas.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.createAlias = function(options) {
  var self = this;
  this.parameters.push('action=CREATEALIAS');
  if(options.name){
    this.parameters.push('name=' + options.name);
  }
  if(options.collections !== undefined){
    if(typeof(options.collections) === 'string'){
      this.parameters.push('collections=' + options.collections);
    } else{
      this.parameters.push('collections=' + options.collections.join());
    }
  }

  return self;
}

/**
 * Delete a collection alias
 * 
 * @param {String} name - Name of the alias to delete
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.deleteAlias = function(name) {
  var self = this;
  this.parameters.push('action=DELETEALIAS');
  if(name){
    this.parameters.push('name=' + name);
  }

  return self;
}

/**
 * Delete a Collection
 *
 * @param {String} name - The name of the collection to be deleted
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.delete = function(name) {
  var self = this;
  this.parameters.push('action=DELETE');
  if(name){
    this.parameters.push('name=' + name);
  }

  return self;
}

/**
 * Delete a replica
 * 
 * @param {Object} options - Options for deleting the replica
 * @param {String} collection - Name of the Collection that includes the replica to be deleted
 * @param {String} shard - Name of the shard that includes the replica to be deleted
 * @param {String} replica - The name of the replica to remove.
 * @param {Boolean} [onlyIfDown] - If true, deletion will only execute if the replica is down/ not active.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.deleteReplica = function(options) {
  var self = this;
  this.parameters.push('action=DELETEREPLICA');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.shard){
    this.parameters.push('shard=' + options.shard);
  }
  if(options.replica){
    this.parameters.push('replica=' + options.replica);
  }
  if(options.onlyIfDown !== undefined){
    this.parameters.push('onlyIfDown=' + options.onlyIfDown);
  }

  return self;
}

/**
 * Add replica
 * 
 * @param {Object} options - Options for adding the replica
 * @param {String} collection - Name of the Collection
 * @param {String} shard - Name of the shard to which the replica will be added
 * @param {String} [route] - If the exact shard name is not known, route can be passed and the system will identify the shard. Ignored if shard is specified.
 * @param {String} [node] - Name of the node where the replica should be created.
 * @param {String} [async] - Request ID to track this action, which will be processed asynchronously.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.addReplica = function(options) {
  var self = this;
  this.parameters.push('action=ADDREPLICA');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.shard){
    this.parameters.push('shard=' + options.shard);
  }
  if(options.route){
    this.parameters.push('_route_=' + options.route);
  }
  if(options.node){
    this.parameters.push('node=' + options.node);
  }
  if(options.async){
    this.parameters.push('async=' + options.async);
  }

  return self;
}

/**
 * Cluster Properties
 * 
 * @param {Object} options - Options for cluster properties
 * @param {String} name - Name of the property. Two supported properties are 'urlScheme' and 'autoAddReplicas.' Others will be rejected by Solr.
 * @param {String} val - Value of the property. If the value is empty or null, the property is unset.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.clusterProp = function(options) {
  var self = this;
  this.parameters.push('action=CLUSTERPROP');
  if(options.name){
    this.parameters.push('name=' + options.name);
  }
  if(options.val !== undefined){
    this.parameters.push('val=' + options.val);
  }

  return self;
}

/**
 * Migrate documents to another collection
 * 
 * @param {Object} options - Options for document migration
 * @param {String} collection - Name of the source collection from which documents will be split.
 * @param {String} targetCollection - Name of the target collection to which documents will be migrated.
 * @param {String} splitKey - The routing key prefix.
 * @param {Number} [forwardTimeout] - The timeout, in seconds, until which write requests made to the source collection for the given split.key will be forwarded to the target shard. Default is 60 seconds.
 * @param {String} [async] - Request ID to track this action which will be processed asynchronously.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.migrate = function(options) {
  var self = this;
  this.parameters.push('action=MIGRATE');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.targetCollection){
    this.parameters.push('target.collection=' + options.targetCollection);
  }
  if(options.splitKey){
    this.parameters.push('split.key=' + options.splitKey);
  }
  if(options.forwardTimeout !== undefined){
    this.parameters.push('forward.timeout=' + options.forwardTimeout);
  }
  if(options.async){
    this.parameters.push('async=' + options.async);
  }

  return self;
}

/**
 * Add Role
 * 
 * @param {Object} options - Options for adding the role
 * @param {String} role - Name of role. Only current supported role is 'overseer'
 * @param {String} node - Name of the node.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.addRole = function(options) {
  var self = this;
  this.parameters.push('action=ADDROLE');
  if(options.role){
    this.parameters.push('role=' + options.role);
  }
  if(options.node){
    this.parameters.push('node=' + options.node);
  }

  return self;
}

/**
 * Remove Role
 * Undo roles assigned using ADDROLE operation
 * 
 * @param {Object} options - Options for removing the role
 * @param {String} role - Name of role. Only current supported role is 'overseer'
 * @param {String} node - Name of the node.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.removeRole = function(options) {
  var self = this;
  this.parameters.push('action=REMOVEROLE');
  if(options.role){
    this.parameters.push('role=' + options.role);
  }
  if(options.node){
    this.parameters.push('node=' + options.node);
  }

  return self;
}

/**
 * Overseer status and statistics
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.overseerStatus = function() {
  var self = this;
  this.parameters.push('action=OVERSEERSTATUS');

  return self;
}

/**
 * Cluster status
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.clusterStatus = function() {
  var self = this;
  this.parameters.push('action=CLUSTERSTATUS');

  return self;
}

/**
 * Request status
 * request the status of an already submitted Asynchronous Collection API call.
 *
 * @param {String} requestid - User-defined request ID from the submitted API call. A value of '-1' will clear the stored states for the already completed/ failed tasks.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.requestStatus = function(requestid) {
  var self = this;
  this.parameters.push('action=REQUESTSTATUS');
  if(requestid){
    this.parameters.push('requestid=' + requestid);
  }

  return self;
}

/**
 * List collections
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.list = function() {
  var self = this;
  this.parameters.push('action=LIST');

  return self;
}

/**
 * Add Replica property
 * 
 * @param {Object} options - Options for replica property
 * @param {String} collection - Name of collection this replica belongs to.
 * @param {String} shard - Name of the shard the replica belongs to.
 * @param {String} replica - The name of the replica
 * @param {String} property - The property to add
 * @param {String} propertyValue - The value to assign to the property.
 * @param {Boolean} [shardUnique] - If set to true, then setting this property in one replica will remove the property from all other replicas in that shard.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.addReplicaProp = function(options) {
  var self = this;
  this.parameters.push('action=ADDREPLICAPROP');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.shard){
    this.parameters.push('shard=' + options.shard);
  }
  if(options.replica){
    this.parameters.push('replica=' + options.replica);
  }
  if(options.property){
    this.parameters.push('property=' + options.property);
  }
  if(options.propertyValue !== undefined){
    this.parameters.push('property.value=' + options.propertyValue);
  }
  if(options.shardUnique !== undefined){
    this.parameters.push('shardUnique=' + options.shardUnique);
  }

  return self;
}

/**
 * Delete Replica property
 * 
 * @param {Object} options - Options for replica property
 * @param {String} collection - Name of collection this replica belongs to.
 * @param {String} shard - Name of the shard the replica belongs to.
 * @param {String} replica - The name of the replica
 * @param {String} property - The property to remove
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.deleteReplicaProp = function(options) {
  var self = this;
  this.parameters.push('action=DELETEREPLICAPROP');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.shard){
    this.parameters.push('shard=' + options.shard);
  }
  if(options.replica){
    this.parameters.push('replica=' + options.replica);
  }
  if(options.property){
    this.parameters.push('property=' + options.property);
  }

  return self;
}

/**
 * Balance a property
 * 
 * @param {Object} options - Options for replica property
 * @param {String} collection - Name of collection to balance the property in.
 * @param {String} property - The property to balance
 * @param {Boolean} [onlyActiveNodes] - Default is true. When true, property is instantiated on active nodes only. If false, inactive nodes will be included.
 * @param {Boolean} [shardUnique] - If set to true, then setting this property in one replica will r
emove the property from all other replicas in that shard.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.balanceShardUnique = function(options) {
  var self = this;
  this.parameters.push('action=BALANCESHARDUNIQUE');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.property){
    this.parameters.push('property=' + options.property);
  }
  if(options.onlyActiveNodes !== undefined){
    this.parameters.push('onlyActiveNodes=' + options.onlyActiveNodes);
  }
  if(options.shardUnique !== undefined){
    this.parameters.push('shardUnique=' + options.shardUnique);
  }

  return self;
}

/**
 * Rebalance leaders
 * 
 * @param {Object} options - Options for replica property
 * @param {String} collection - Name of collection to rebalance preferredLeaders on.
 * @param {Number} [maxAtOnce] - The maximum number of reassignments to have queue up at once.
 * @param {Number} [maxWaitSeconds] - Timeout value (seconds) when waiting for leaders to be reassigned. Default is 60.
 *
 * @return {Collection}
 * @api public
 */
Collection.prototype.rebalanceLeaders = function(options) {
  var self = this;
  this.parameters.push('action=REBALANCELEADERS');
  if(options.collection){
    this.parameters.push('collection=' + options.collection);
  }
  if(options.maxAtOnce !== undefined){
    this.parameters.push('maxAtOnce=' + options.maxAtOnce);
  }
  if(options.maxWaitSeconds !== undefined){
    this.parameters.push('maxWaitSeconds=' + options.maxWaitSeconds);
  }

  return self;
}

/**
 * Build a querystring with the array of `this.parameters`.
 *
 * @return {String}
 * @api private
 */
Collection.prototype.build = function(){
  return this.parameters.join('&');
}
