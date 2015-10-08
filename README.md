#solr-client - a node.js solr client
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/lbdremy/solr-node-client?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![](https://secure.travis-ci.org/lbdremy/solr-node-client.png)](http://travis-ci.org/#!/lbdremy/solr-node-client) [![Dependency Status](https://gemnasium.com/lbdremy/solr-node-client.png)](https://gemnasium.com/lbdremy/solr-node-client)

[![NPM](https://nodei.co/npm/solr-client.png?downloads=true&stars=true)](https://nodei.co/npm/solr-client/)

##Install

```
npm install solr-client
```

##Features

###Latest (0.6.0)

- Solr5 Query-Highlighting support through StandardHighlighter (@LukeTavern) (https://github.com/lbdremy/solr-node-client/pull/144)
- Experimental support for SolrCloud collections administration (@LukeTavern) (https://github.com/lbdremy/solr-node-client/issues/138)
- Support for large query through POST via configurable automatic switch (@kfitzgerald) (https://github.com/lbdremy/solr-node-client/pull/129) 
- Set Default Field (query.df()) (@cbarrientos-ias) (https://github.com/lbdremy/solr-node-client/pull/137)
- Adds support for facet.pivot and facet.pivot.mincount (@nicolasembleton) (https://github.com/lbdremy/solr-node-client/issues/146)
 
Noticeable change: You can now pass a solrVersion to the Client initialization so it will activate features that  are only supported 
by your version or higher. Be sure to check the documentation

###0.5.0

- Commands supported: search(select), add, delete, update, commit, rollback, optimize, ping, real-time get, prepare commit, soft commit, arbitrary search handler (i.e: mlt, luke ...)
- Lucene query / DisMax query
- Grouping / Field Collapsing. (Apache Solr version must be >= 3.3)
- Convenients methods for querying with Facet, MoreLikeThis
- HTTP Basic Access Authentication
- Over HTTPS as well
- Use json-bigint to handle correctly numbers too large for Javascript Number such as the values of the fields *_l and \_version\_. By default json-bigint library is not used because the performance difference compared to the native JSON library is too important with "large" chunk of JSON (https://github.com/lbdremy/solr-node-client/issues/114#issuecomment-54165595), but you want to enable it if you use the Optimistic Concurreny feature available in Solr 4.x, along with RealTime Get and Atomic Updates features because they use the \_version\_ field. In order to enable it do `var client = solr.createClient({ bigint : true})` or directly on the client instance `client.options.bigint = true`.

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
      console.log('Solr response:', obj);
   }
});
```

##Migration between 0.5.x and 0.6.x

No breaking change has been introduced to this release. However, to take advantage of facet.pivot and facet.pivot.mincount feature,
you'll need to pass a solrVersion parameter to the createClient() method. 

Example:

```js
// Will activate features specific to Solr4.0 and above (like facet.pivot and facet.pivot.mincount)
var client = solr.createClient({
 solrVersion: '4.0'
});
```

A feature allowing to support large queries by switching to POST when the query size reaches the threshold was introduced. To not become
a breaking change, it is by default turned OFF. 
  
To activate it, pass the property `get_max_request_entity_size` to the createClient with the threshold in bytes. Minimum is 1.
 
Example:

```js
// Will switch to POST as soon as the query size reaches 1000 bytes (limit in servers is usually 2048 or 8192)  
// You can set it to 1 so every request will always use POST. 
var client = solr.createClient({
 get_max_request_entity_size: 1000
});
```

##Migration between 0.4.x and 0.5.x

The only breaking change introduced in `0.5.x` is introduced in this commit [3cbc7fc6cf631f019a4626913c0a4b616092133b](https://github.com/lbdremy/solr-node-client/commit/3cbc7fc6cf631f019a4626913c0a4b616092133b) which remove escaping of the Solr special characters in some of the methods of the `Query` class i.e in `Query#rangeFilter`, `Query#matchFilter`, `Query#group`, `Query#facet`, `Query#mlt` if you were relying on this behavior just wrap the arguments you passed to those methods into the [`solr.escapeSpecialChars(arg)`](https://github.com/lbdremy/solr-node-client/blob/master/lib/solr.js#L605) method.

For example, for some weird reason you wanted to escape the special char `*`, don't ask me ;)

```js
var query = client.createQuery();
query.q({ '*' : '*' }).rangeFilter({ field : 'id', start : 100, end : '*'})
```

You still can:

```js
var query = client.createQuery();
query.q({ '*' : '*' }).rangeFilter({ field : 'id', start : 100, end : solr.escapeSpecialChars('*')})
```

Post an issue if you have troubles migrating to v0.5.0.

##Migration between 0.3.x and 0.4.x

The only breaking change introduced in `0.4.x` is about JSON serialization/deserialization of numbers too large for Javascript Number type. If you were using the Optimistic Concurreny feature available in Solr 4.x, along with RealTime Get and Atomic Updates features which use the \_version\_ field or *_l type fields you are affected about this change otherwise you are just fine.

If you affected in order to fix that just initialize your client with the `bigint` flag set to `true`:

```js
var client = solr.createClient({ bigint : true });
```

or directly on the `Client` instance:

```js
client.options.bigint = true;
```

Post an issue if you have troubles migrating to v0.4.0.

##Migration between 0.2.x and 0.3.x

The only breaking change introduced in `v0.3.0` is about method chaining of the solr `Client`.
Method chaining as simply been removed because we were actually hidding something really interesting and useful
the `http.ClientRequest` instance.

So, before you could have done this:

```js
var client = solr.createClient();

client
	.search('q=hello', function(err, obj){
		console.log(err, obj);
	})
	.search('q=world', function(err, obj){
		console.log(err, obj);
	});
```

Now it won't work, but you have now access to the `http.ClientRequest` instead created by `Client#search`:

```js
var client = solr.createClient();

var request = client.search('q=hello', function(err, obj){
	console.log(err, obj);
});
request.setTimeout(200, function(){
	console.log('search timeout');
});
```

Post an issue if you have troubles migrating to v0.3.0.

##Roadmap

###v0.3.x - v0.x.x

- Test suite with mocha and chai instead of vows
- Implement all features available in Solr 4 (SolrCloud API in particular)
- Provide all low-level commands
- Complete documentation

###v1.0.x

- First stable version
- the API is frozen until v2.0.x, only new features and bug fixes can be introduced

##Test

```
npm test
```

Tests are executed against a running SOLR instance, so you might want to:
- install the schema.xml and solrconfig.xml expected by the tests. You find these in test/materials
- make sure your solr instance is running
- specifiy non-default connection params to your server in test/config.json You can inject these also on the command line through:

```
mocha test/*-test.js --client.core=test-node-client --client.port=8080
```

## Test coverage

Before to be able to run the command below, you will need to install jscoverage available here https://github.com/visionmedia/node-jscoverage.

```
npm run-script test-cov
```

This command will generate a file named `coverage.html`, use your browser to visualize it.

## Static analysis and complexity report

```
npm run-script report
```

##Licence

(The MIT License)

Copyright 2011-2012 HipSnip Limited

Copyright 2013-2014 Rémy Loubradou
