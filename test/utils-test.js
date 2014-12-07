/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	format = require( libPath + '/utils/format');

// Test suite

describe('format',function(){
	describe('.escapeSpecialChars(string)',function(){
		it('should escape all special characters',function(){
			var string = '+-&&||!(){}[]^"~*?:\\';
        	var escapedString = format.escapeSpecialChars(string);
        	assert.equal(escapedString,'\\+\\-\\&\\&\\|\\|\\!\\(\\)\\{\\}\\[\\]\\^\\"\\~\\*\\?\\:\\\\');
		});
	});
	describe('.dateISOify()',function(){
		it('should convert all Date objects into ISO string representation of the time',function(){
			var date = new Date();
			var dateISOify = format.dateISOify(date);
			assert.equal(dateISOify,date.toISOString());
			var dateHash = { now : date};
			var dateHashISOify = format.dateISOify(dateHash);
			assert.equal(dateHashISOify.now,date.toISOString());
			var dateArray = [date];
			var dateArrayISOify = format.dateISOify(dateArray);
			assert.equal(dateArrayISOify[0],date.toISOString());
		});
	});
});
