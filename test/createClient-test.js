/**
 * Modules dependencies
 */

var mocha = require('mocha'),
  assert = require('chai').assert,
  libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
  solr = require(libPath + '/solr'),
  https = require('https');

// Test suite

describe('solr', function() {
  describe('.createClient()', function() {
    it('should return a `Client` instance', function() {
      var client = solr.createClient();
      assert.equal(client.options.servers.length, 1);
      assert.equal(client.options.servers[0], '127.0.0.1:8983');
      assert.equal(client.options.core, '');
      assert.equal(client.options.path, '/solr');
    });
  });
  describe('.createClient({ servers : "10.10.10.10:8080", core : "core1", path : "/solr4"})', function() {
    it('should return a `Client` instance with the given options', function() {
      var options = {
        servers: ['10.10.10.10:8080'],
        core: 'core1',
        path: '/solr4'
      };
      var client = solr.createClient(options);
      assert.equal(client.pool.nodes.length, 1);
      assert.equal(client.pool.nodes[0].ip,'10.10.10.10');
      assert.equal(client.pool.nodes[0].port,'8080');
      assert.equal(client.options.core, 'core1');
      assert.equal(client.options.path, '/solr4');
    });
  });
  describe('.createClient(["10.10.10.10:8080"],"core1","/solr4")', function() {
    it('should return a `Client` instance with the given options', function() {
      var client = solr.createClient(['10.10.10.10:8080'], 'core1', '/solr4');
      assert.equal(client.pool.nodes.length, 1);
      assert.equal(client.pool.nodes[0].ip,'10.10.10.10');
      assert.equal(client.pool.nodes[0].port,'8080');
      assert.equal(client.options.core, 'core1');
      assert.equal(client.options.path, '/solr4');
    });
  });
  describe('.createClient({ secure : true })', function() {
    it('should create a `Client` instance with secure set to true', function() {
      var options = {
        secure: true
      };
      var client = solr.createClient(options);
      assert.equal(client.pool.http, https);
    });
  });
  describe('.createClient({servers:["10.10.10.10:8080", "11.11.11.11:8888"],core:"core1",paht:"/solr4"})', function(){
    it('should create a `Client` instance with two servers', function(){
      var options = {
        servers: ['10.10.10.10:8080', '11.11.11.11:8888'],
        core: 'core1',
        path: '/solr4'
      };
      var client = solr.createClient(options);
      assert.equal(client.pool.nodes.length, 2);
      assert.equal(client.pool.nodes[0].ip,'10.10.10.10');
      assert.equal(client.pool.nodes[0].port,'8080');
      assert.equal(client.pool.nodes[1].ip,'11.11.11.11');
      assert.equal(client.pool.nodes[1].port,'8888');
      assert.equal(client.options.core, 'core1');
      assert.equal(client.options.path, '/solr4');
    });
  });
});
