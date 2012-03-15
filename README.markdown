#solr-client - a node.js solr client
 
##Install

```
npm install solr-client
```
    
##Usage

```js
// Load dependency
var solr = require('solr-client');

// Create a client
var client = solr.createClient();

// Add a new document
client.add({ id : 12, title_t : 'Hello' },function(err,json){
   if(err){
      console.log(err);
   }else{
      console.log('JSON response:' + json);
   }
});
```

##Commmands & API supported
 - commands: query, delete, update, commit, rollback, optimize, ping
 - Lucene query / DisMax query 
 - Grouping / Field Collapsing. (Apache Solr version must be [>= 3.3](http://svn.apache.org/repos/asf/lucene/dev/tags/lucene_solr_3_3/solr/CHANGES.txt))
 - Facet
 - HTTP Basic Access Authentication

##Test
Before to run the test, start the Solr Server.

```js
npm test
```
