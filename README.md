# solr-client - a node.js solr client
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lbdremy/solr-node-client?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![](https://github.com/lbdremy/solr-node-client/workflows/CI/badge.svg)
[![NPM](https://nodei.co/npm/solr-client.png?downloads=true&stars=true)](https://nodei.co/npm/solr-client/)


## Installation

Install the library with:

```shell
npm install --save solr-client
```

## Documentation

Node.js version 6+ is supported.
Solr versions 3-8 are supported.

* See the [official documentation](http://lbdremy.github.com/solr-node-client/) for more details.
* If you are upgrading from an earlier version, please see the [migration guide](https://github.com/lbdremy/solr-node-client/blob/master/UPGRADING.md).
* You can also check out the [changelog](https://github.com/lbdremy/solr-node-client/blob/master/CHANGELOG.md).

## Usage

```js
// Load dependency
const solr = require('solr-client');

// Create a client
const client = solr.createClient();

// Add a new document
client.add({ id : 12, title_t : 'Hello' },function(err,obj){
   if (err) {
      console.log(err);
   } else {
      console.log('Solr response:', obj);
   }
});
```



## Roadmap

### v0.3.x - v0.x.x

- Implement all features available in Solr 4 (SolrCloud API in particular)
- Provide all low-level commands
- Complete documentation

### v1.0.x

- First stable version
- the API is frozen until v2.0.x, only new features and bug fixes can be introduced

## Test

Tests are executed against a Solr instance in a Docker container. In order to execute them on latest supported Solr version, run:

```
npm run solr:current:start
npm test
```

If you want to execute them on oldest Solr version supported, run `solr:legacy:start` instead.


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

## Licence

(The MIT License)

Copyright 2011-2012 HipSnip Limited

Copyright 2013-2014 Rémy Loubradou
