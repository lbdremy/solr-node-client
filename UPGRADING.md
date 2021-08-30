# Migration guide

## 0.5.x to 0.6.x

No breaking change has been introduced to this release. However, to take advantage of facet.pivot and facet.pivot.mincount feature,
you'll need to pass a solrVersion parameter to the createClient() method.

Example:

```js
// Will activate features specific to Solr4.0 and above (like facet.pivot and facet.pivot.mincount)
const client = solr.createClient({
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
const client = solr.createClient({
 get_max_request_entity_size: 1000
});
```

## 0.4.x to 0.5.x

The only breaking change introduced in `0.5.x` is introduced in this commit [3cbc7fc6cf631f019a4626913c0a4b616092133b](https://github.com/lbdremy/solr-node-client/commit/3cbc7fc6cf631f019a4626913c0a4b616092133b) which remove escaping of the Solr special characters in some of the methods of the `Query` class i.e in `Query#rangeFilter`, `Query#matchFilter`, `Query#group`, `Query#facet`, `Query#mlt` if you were relying on this behavior just wrap the arguments you passed to those methods into the [`solr.escapeSpecialChars(arg)`](https://github.com/lbdremy/solr-node-client/blob/master/lib/solr.js#L605) method.

For example, for some weird reason you wanted to escape the special char `*`, don't ask me ;)

```js
const query = client.query();
query.q({ '*': '*' }).rangeFilter({ field: 'id', start: 100, end: '*' })
```

You still can:

```js
const query = client.query();
query.q({ '*': '*' }).rangeFilter({ field: 'id', start: 100, end: solr.escapeSpecialChars('*') })
```

Post an issue if you have troubles migrating to v0.5.0.

## 0.3.x to 0.4.x

The only breaking change introduced in `0.4.x` is about JSON serialization/deserialization of numbers too large for Javascript Number type. If you were using the Optimistic Concurreny feature available in Solr 4.x, along with RealTime Get and Atomic Updates features which use the \_version\_ field or *_l type fields you are affected about this change otherwise you are just fine.

If you affected in order to fix that just initialize your client with the `bigint` flag set to `true`:

```js
const client = solr.createClient({ bigint : true });
```

or directly on the `Client` instance:

```js
client.options.bigint = true;
```

Post an issue if you have troubles migrating to v0.4.0.

## 0.2.x to 0.3.x

The only breaking change introduced in `v0.3.0` is about method chaining of the solr `Client`.
Method chaining as simply been removed because we were actually hidding something really interesting and useful
the `http.ClientRequest` instance.

So, before you could have done this:

```js
const client = solr.createClient();

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
const client = solr.createClient();

const request = client.search('q=hello', function(err, obj){
	console.log(err, obj);
});
request.setTimeout(200, function(){
	console.log('search timeout');
});
```

Post an issue if you have troubles migrating to v0.3.0.
