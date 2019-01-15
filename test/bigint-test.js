// Testing support for really big long values in json coming from solr
// specially values that are bigger then what javascript can keep in Number variables without loosing precision

/**
 * Modules dependencies
 */

var mocha = require('mocha'),
    figc = require('figc'),
    assert = require('chai').assert,
    libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
    solr = require( libPath + '/solr'),
    sassert = require('./sassert'),
    BigNumber = require('bignumber.js');

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,'');

// Force Solr client to handle big integers
client.options.bigint = true;


describe('Client',function(){
    describe('Checking support for longs passed down in json formats to/from solr',function(){

        var _version_ = new BigNumber(-1); // -1 ensures document doesn't exist prior to test
        var id = 'RandomId-' + Math.floor(Math.random() * 1000000);
        var big = '9007199254740993'; // deliberately kept as a string to avoid truncate before test
        var small = '97';             // same showing string-conversion is not at fault
        var doc = {
            id : id,
            small_l : small,
            big_l: big,
            _version_: _version_.toString()
        };
        var add_options = {
          commit : true, // force commit, not really needed, but it ensures full process cycle at solr side
          versions: true // feedback optimistic concurrency info for later update
        };

        it('should add the document with commit and versions true',function(done){
            client.add(doc, add_options, function(err,data){
                sassert.ok(err,data);
                assert.ok(big != Number(big).toString(), 'the big number used for testing should exceed the limits of javascript Number variables');
                assert.ok(big == (new BigNumber(big)).toString(), 'the big number used for testing should not exceed the limits of BigNumber processing');
                _version_ = new BigNumber(data.adds[1].toString());
                assert.ok(_version_.comparedTo(0) == 1, '_version_ should be set to a positive number');
                done();
            });
        });

        it('should be able to get that specific document with the big-long unchange and in full glory',function(done){
      // note that by default the /get handler will have omitHeader=true configured on the server!
            client.realTimeGet(id,{omitHeader: false}, function(err,data){
                sassert.ok(err,data);
                assert.equal(data.response.numFound, 1, 'Added document should be retrieved in real-time get.');
                var retrieved = data.response.docs[0];
                assert.equal(retrieved.id, id, 'Didn\'t retrieve the expected document.');
                assert.equal(retrieved.small_l.toString(), small, 'Didn\'t retrieve the expected small value.');
                assert.equal(retrieved.big_l.toString(), big, 'Didn\'t retrieve the expected big value.');
                assert.equal(retrieved._version_.toString(), _version_, 'Didn\'t retrieve the expected big value.');
                done();
            });
        });

        it('should be able to update that specific document when respecting optimistic lock needs',function(done){
            doc._version_ = _version_.toString(); // needed for optimistic lock check
            doc.new_t = 'new text field';

            client.add(doc, add_options, function(err,data){
                sassert.ok(err,data);
                var prev_version_ = _version_;
                _version_ = new BigNumber(data.adds[1].toString());
                assert.ok(_version_.comparedTo(prev_version_) == 1, 'new _version_ should be bigger then previous');
                done();
            });
        });

        it('should be able to delete it',function(done){
            client.deleteByID(id,function(err,data){
                sassert.ok(err,data);
                done();
            });
        });

    });
});
