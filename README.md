# solr-client - a node.js solr client
[![NPM Version](https://img.shields.io/npm/v/solr-client.svg)](https://npmjs.org/package/solr-client)
[![NPM Downloads](https://img.shields.io/npm/dm/solr-client.svg)](https://npmjs.org/package/solr-client)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lbdremy/solr-node-client?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![](https://github.com/lbdremy/solr-node-client/workflows/CI/badge.svg)

## Installation

Install the library with:

```shell
npm install solr-client
```

or

```shell
yarn add solr-client
```

## Documentation

Node.js version 12+ is supported.
Solr versions 3-8 are supported.

* See the [official documentation](https://lbdremy.github.io/solr-node-client/) for more details.
* If you are upgrading from an earlier version, please see the [migration guide](https://github.com/lbdremy/solr-node-client/blob/master/UPGRADING.md).
* You can also check out the [changelog](https://github.com/lbdremy/solr-node-client/blob/master/CHANGELOG.md).

## Usage (callback API in 0.9.0 and older)

```js
// Load dependency
const solr = require('solr-client');

// Create a client
const client = solr.createClient();

// Add a new document
const obj = await client.add({ id : 12, title_t : 'Hello' });
console.log('Solr response:', obj);
```

## Usage (promise API in 0.10.0+`)

```js
// Load dependency
const solr = require('solr-client');

// Create a client
const client = solr.createClient();

// Add a new document
const obj = await client.add({ id : 12, title_t : 'Hello' });
console.log('Solr response:', obj);
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

Tests are executed against a Solr instance in a Docker container. 

To execute them on latest supported Solr version, run:

```shell
npm run solr:current:start
npm run test:current
```

If you want to execute them on oldest Solr version supported, run:

```shell
npm run solr:legacy:start
npm run test:legacy
```
## Windows 10 and Docker

#### Windows 10 Pro or Enterprise

If you have a version of Windows 10 Pro or Enterprise, simply download [Docker Desktop](https://docs.docker.com/desktop/windows/install/). Ensure that Hyper-V is enabled, and [virtualization](https://docs.docker.com/desktop/windows/troubleshoot/#virtualization-must-be-enabled) is enabled in your motherboard's BIOS. It may prompt you to install updates to Windows during Docker Desktop installation and then restart the system.

#### Windows 10 Home

If you have a version of Windows 10 Home, a little more effort is needed. By default, Hyper-V cannot be turned on for Home edition.
**The steps that seem to work:**
- Check to ensure you have WSL1, WSL2, and the Kernel Update. This can be done using the shell commands found [here](https://blog.devgenius.io installing-docker-onwindows-10-home-edition-2e7c1b79d76d). 
- [Follow the instructions in this link](https://www.itechtics.com/enable-hyper-v-windows-10-home/) to install Hyper-V. Please note, that you must have WSL1/WSL2 and the update for Hyper-V to install properly or the changes may be undone during restart.
- After restarting and checking that Hyper-V is enabled, you may install [Docker Desktop](https://docs.docker.com/desktop/windows/install/) using the setup wizard.

## Test coverage

Before to be able to run the command below, you will need to install jscoverage available 
[here](https://github.com/visionmedia/node-jscoverage).

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
