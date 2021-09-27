import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import * as sassert from './sassert';

const config = figc(__dirname + '/config.json');
const config2 = figc(__dirname + '/config2.json');
const client = createClient(config.client);
const client2 = createClient(config2.client);
[config.client.path, config.client.core].join('/').replace(/\/$/, '');

describe('Client#createQuery', function () {
  describe('.rangeFilter(start, end)', function () {
    it('should filter a query using a range join', function (done) {
      const query = client.query().q('test').joinFilter({
        fromIndex: 'organizations',
        from: 'organizationId_i',
        to: 'id',
        field: 'name',
        value: 'test',
      });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal(
          data.responseHeader.params.fq,
          `"{!join fromIndex=organizations from=organizationId_i to=id v='name:test'}"`
        );
        done();
      });
    });
    it('should filter a query using a range join 2 cores', function (done) {
      const docs = [
        {
          id: 1,
          region_s: 'east',
          sales_i: 100000,
        },
        {
          id: 2,
          region_s: 'west',
          sales_i: 200000,
        },
        {
          id: 3,
          region_s: 'north',
          sales_i: 300000,
        },
        {
          id: 7,
          region_s: 'south',
          sales_i: 400000,
        },
      ];
      client.add(docs, function (err, data) {
        sassert.ok(err, data);
        done();
      });

      const docsOrganizations = [
        {
          id: 1,
          name_s: 'chris',
          region_s: 'east',
          salary_i: 100000,
          mgr_s: 'yes',
        },
        {
          id: 2,
          name_s: 'jen',
          region_s: 'west',
          salary_i: 200000,
          mgr_s: 'yes',
        },
        {
          id: 3,
          name_s: 'james',
          region_s: 'east',
          salary_i: 75000,
          mgr_s: 'no',
        },
        {
          id: 4,
          name_s: 'ruby',
          region_s: 'north',
          salary_i: 50000,
          mgr_s: 'yes',
        },
        {
          id: 5,
          name_s: 'charlotte',
          region_s: 'west',
          salary_i: 120000,
          mgr_s: 'yes',
        },
      ];
      client2.add(docsOrganizations, function (err, data) {
        sassert.ok(err, data);
        done();
      });

      const query = client.query().q('test').joinFilter({
        fromIndex: 'organizations',
        from: 'region_s',
        to: 'region_s',
        field: 'mgr_s',
        value: 'yes',
      });

      client.search(query, function (err, data) {
        sassert.ok(err, data);
        assert.equal(
          data.responseHeader.params.fq,
          `"{!join fromIndex=organizations from=organizationId_i to=id v='name:test'}"`
        );
        done();
      });
    });
  });
});
