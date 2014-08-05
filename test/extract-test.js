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
                var fields = {};
                fields.id = "TEST-EXTRACT-" + file;
                fields.path = contentPath + '/' + file;
                client.extractFileContents(fields.path,fields,options,function(err,data){
                    sassert.ok(err,data);
                    done();
                });
            });
        });
	});
});
