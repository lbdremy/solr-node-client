/**
 * Load dependencies
 */
var querystring = require('querystring'),
    format = require('./utils/format');

/**
 * Expose `Collections`
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
  //array and string
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






















