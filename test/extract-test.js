// Testing support for Extracting -- http://wiki.apache.org/solr/ExtractingRequestHandler
/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	figc = require('figc'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	solr = require( libPath + '/solr'),
	sassert = require('./sassert')
    fs = require('fs');

// Test suite
var config = figc(__dirname + '/config.json');
var client = solr.createClient(config.client);
var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/,"");

var contentPath = __dirname + '/materials/extract';

describe('Client',function(){
	describe('Extract functionality loading various files',function(){
        var options = {};
        var files = fs.readdirSync(contentPath);
        
        files.forEach(function(file, i) {
            it('should load & extract test-document ' + file,function(done){
                var doc = {};
                doc.id = "TEST-EXTRACT-" + file;
                doc.path = contentPath + '/' + file;
                var extractStream = client.createExtractStream(doc,options);
                var err = null, data = null;
                extractStream
                    .on('error', function(error){
                        err = error;
                    })
                    .on('data' , function(obj){
                        data = obj;
                    })
                    .on('end',   function(){
                        sassert.ok(err,data);
                        done();
                    });
                fs.createReadStream(doc.path).pipe(extractStream);
            });
        });
	});
});
