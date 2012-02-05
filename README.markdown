#Solr Client

##Features
 - Support commands: Query, Delete, Update, Commit, Rollback, Optimize, Ping
 - Support Dismax Query Syntax
 - Support implicit conversion for `Date` Object to the supported format by Solr.
 More informations available about [the Solr Date Format](http://lucidworks.lucidimagination.com/display/LWEUG/Solr+Date+Format).
 - Support Grouping / Field Collapsing. (works on Apache Solr version [>= 3.3](http://svn.apache.org/repos/asf/lucene/dev/tags/lucene_solr_3_3/solr/CHANGES.txt))
 - Support HTTP Basic Access Authentication
  
##History
 - _!WARNING!_ On the v0.0.3 I [standardized error handling](http://docs.nodejitsu.com/articles/errors/what-are-the-error-conventions) in asynchronous functions by returning them as the first argument to the current function's callback and not as the second argument like it's was the case on version < 0.0.3. This modification can break you code have a look to your code before you update.
 
##Install

```
npm install solr-client
```    
##Get started

```js
// Dependency
var solr = require('solr-client');

//Create Client
var client = solr.createClient();

//Add
var doc = {
  field : 'value';
}
var callback = function(err,res){
  if(err) console.log(err);
  if(res) console.log(res);
}
client.add(doc,callback);
client.commit(callback);
```

##Test
Before to run the test, start the Solr Server.

```js
// With vows
vows --spec test/*

// With npm
npm test
```

##Examples

Take a look in the [folder examples](https://github.com/lbdremy/solr-node-client/tree/master/examples).
