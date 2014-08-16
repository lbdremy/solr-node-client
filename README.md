#solr-client - a node.js solr client

[![](https://secure.travis-ci.org/lbdremy/solr-node-client.png)](http://travis-ci.org/#!/lbdremy/solr-node-client) [![Dependency Status](https://gemnasium.com/lbdremy/solr-node-client.png)](https://gemnasium.com/lbdremy/solr-node-client)

[![NPM](https://nodei.co/npm/solr-client.png?downloads=true&stars=true)](https://nodei.co/npm/solr-client/)

##Install

```
npm install solr-client
```

##Features

- Commands supported: search(select), add, delete, update, commit, rollback, optimize, ping, real-time get, prepare commit, soft commit, arbitrary search handler (i.e: mlt, luke ...)
- Lucene query / DisMax query
- Grouping / Field Collapsing. (Apache Solr version must be >= 3.3)
- Convenients methods for querying with Facet, MoreLikeThis
- HTTP Basic Access Authentication
- Over HTTPS as well
- Use json-bigint to parse and stringify correctly *_l fields of Solr

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
##Roadmap

###v0.3.x

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

## Static analysis and complexity report

```
npm run-script report
```

This command will generate a file named `coverage.html`, use your browser to visualize it.

##Licence

(The MIT License)

Copyright 2011-2012 HipSnip Limited

Copyright 2013-2014 Rémy Loubradou
