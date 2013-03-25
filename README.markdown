#solr-client - a node.js solr client

[![](https://secure.travis-ci.org/lbdremy/solr-node-client.png)](http://travis-ci.org/#!/lbdremy/solr-node-client) [![Dependency Status](https://gemnasium.com/lbdremy/solr-node-client.png)](https://gemnasium.com/lbdremy/solr-node-client)

##Install

```
npm install solr-client
```

##Features
- Commands supported: search(select), index, delete, update, commit, rollback, optimize, ping
- Lucene query / DisMax query
- Grouping / Field Collapsing. (Apache Solr version must be >= 3.3)
- Convenients methods for querying with Facet, MoreLikeThis
- HTTP Basic Access Authentication

##Documentation
See the website at http://lbdremy.github.com/solr-node-client/.

##Usage

```js
// Load dependency
var solr = require('solr-client');

// Create a client
var client = solr.createClient();

// Add a new document
client.add({ id : 12, title_t : 'Hello' },function(err,obj){
   if(err){
      console.log(err);
   }else{
      console.log('Solr response:' + obj);
   }
});
```

##Test

```js
npm test
```
HTTP requests and responses expected are mocked thanks to __nock__. To disable the mocking go to `test/config.json` and set `mocked` to `false`.

##Licence
(The MIT License)
Copyright 2011-2012 HipSnip Limited
