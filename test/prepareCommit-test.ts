import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './utils/sassert';
import * as versionUtils from '../lib/utils/version';
import { dataOk } from './utils/sassert';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#prepareCommit(callback)', function () {
    it('should prepare the commit', async () => {
      const request = await client.prepareCommit();
      dataOk(request);
    });
  });
});

// Support
// http://wiki.apache.org/solr/UpdateXmlMessages?highlight=%28softCommit%29#A.22prepareCommit.22
