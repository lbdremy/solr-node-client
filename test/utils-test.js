/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
	format = require( libPath + '/utils/format'),
	arrayUtils = require(libPath + '/utils/array'),
	typeUtils = require(libPath + '/utils/type');

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
describe('typeUtils', function() {
	describe('.isNumber(), strict', function() {
		it('should detect positively a parameter that contains a primitive number', function() {
			assert.equal(typeUtils.isNumber(0), true, '0 is a number');
			assert.equal(typeUtils.isNumber(-1), true, '-1 is a number');
			assert.equal(typeUtils.isNumber('-1'), true, '"-1" is a number (parseInt valid)');
			assert.equal(typeUtils.isNumber('0'), true, '"0" is a number');
			assert.equal(typeUtils.isNumber('1'), true, '"1" is a number');
			assert.equal(typeUtils.isNumber('1000000'), true, '"1000000" is a number');
			assert.equal(typeUtils.isNumber('100000000'), true, '"100000000" is a number');
		});
		it('should detect negatively a parameter that contains a mixed number or no number', function() {
			assert.equal(typeUtils.isNumber('1a'), false, '"1a" is not a number (mixed number)');
			assert.equal(typeUtils.isNumber('- 1'), false, '"- 1" is not a number (not parseInt valid)');
			assert.equal(typeUtils.isNumber('a123'), false, '"a123" is not a number (not parseInt valid)');
			assert.equal(typeUtils.isNumber('a'), false, '"a" is not a number (string)');
			assert.equal(typeUtils.isNumber(''), false, '"" is not a number (string)');
		});
	});
	describe('.isNumber(), non strict', function() {
		it('should detect positively a parameter that contains a primitive and a mixed number', function() {
			assert.equal(typeUtils.isNumber(0, false), true, '0 is a number');
			assert.equal(typeUtils.isNumber(-1, false), true, '-1 is a number');
			assert.equal(typeUtils.isNumber('-1', false), true, '"-1" is a number (parseInt valid)');
			assert.equal(typeUtils.isNumber('0', false), true, '"0" is a number');
			assert.equal(typeUtils.isNumber('1', false), true, '"1" is a number');
			assert.equal(typeUtils.isNumber('1000000', false), true, '"1000000" is a number');
			assert.equal(typeUtils.isNumber('100000000', false), true, '"100000000" is a number');
			assert.equal(typeUtils.isNumber('1a', false), true, '"1" is a number (parseInt valid)');
			assert.equal(typeUtils.isNumber('1123a', false), true, '"1123" is a number (parseInt valid)');
		});
		it('should detect negatively a parameter that contains no valid number', function() {
			assert.equal(typeUtils.isNumber('- 1', false), false, '"- 1" is not a number (not parseInt valid)');
			assert.equal(typeUtils.isNumber('a123', false), false, '"a123" is not a number (not parseInt valid)');
			assert.equal(typeUtils.isNumber('a', false), false, '"a" is not a number (string)');
			assert.equal(typeUtils.isNumber('', false), false, '"" is not a number (string)');
		});
	});
});
describe('array', function() {
	describe('.toArray()', function() {
		it('should array-ize everything', function() {
			assert.equal(Array.isArray(arrayUtils.toArray([])), true, '[] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray('')), true, '[""] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray([{a: 123}])), true, '[{a: 123}] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray([1])), true, '[1] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray(['a'])), true, '["a"] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray([0])), true, '[0] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray([-1])), true, '[-1] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray('')), true, '[""] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray(0)), true, '[0] is an array');
			assert.equal(Array.isArray(arrayUtils.toArray()), true, '[] is an array');
		});
		it('should handle null and undefined properly', function() {
			assert.equal(arrayUtils.toArray(undefined, '')[0] === '', true, 'undefined was cleaned up as empty string');
			assert.equal(arrayUtils.toArray(undefined)[0] === '', true, 'using the default setup, undefined was cleaned up as empty string');
			assert.equal(arrayUtils.toArray(null, '')[0] === '', true, 'null was cleaned up as empty string');
			assert.equal(arrayUtils.toArray(null)[0] === '', true, 'using the default setup, null was cleaned up as empty string');
		});
	});
});
