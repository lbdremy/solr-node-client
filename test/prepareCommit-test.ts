import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';
import * as versionUtils from '../lib/utils/version';

const config = figc(__dirname + '/config.json');
const client = createClient(config.client);
const basePath = [config.client.path, config.client.core]
  .join('/')
  .replace(/\/$/, '');

describe('Client', function () {
  describe('#prepareCommit(callback)', function () {
    it('should prepare the commit', function (done) {
      const request = client.prepareCommit(function (err, data) {
        sassert.ok(err, data);
        if (
          client.solrVersion &&
          versionUtils.version(client.solrVersion) >= versionUtils.Solr4_0
        ) {
          assert.equal(
            request.path,
            basePath + '/update?prepareCommit=true&wt=json'
          );
        } else {
          assert.equal(
            request.path,
            basePath + '/update/json?prepareCommit=true&wt=json'
          );
        }
        done();
      });
    });
  });
});

// Support
// http://wiki.apache.org/solr/UpdateXmlMessages?highlight=%28softCommit%29#A.22prepareCommit.22
