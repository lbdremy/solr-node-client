/**
 * Module dependencies
 */

var HTTPError = require('httperror'),
   util = require('util');

/**
 * Expose `SolrError`
 */

module.exports = SolrError;

/**
 * Create a new `SolrError`
 * @constructor
 *
 * @return {SolrError}
 * @api private
 */

function SolrError(req,res,htmlMessage){
   var message = '';
   if(htmlMessage){
      var matches = htmlMessage.match(/<pre>([\s\S]+)<\/pre>/);
      message = decode((matches || ['', htmlMessage])[1].trim());
   }
   HTTPError.call(this, req, res, message);
   Error.captureStackTrace(this,arguments.callee);
   this.statusCode = res.statusCode;
   this.message = res.statusMessage;
   this.name = 'SolrError';
}

util.inherits(SolrError, HTTPError);

/**
 * Decode few HTML entities: &<>'"
 *
 * @param {String} str -
 *
 * @return {String}
 * @api private
 */
function decode(str) {
  return str.replace(/&amp;/g,'&')
            .replace(/&lt;/gm, '<')
            .replace(/&gt;/gm, '>')
            .replace(/&apos;/gm, '\'')
            .replace(/&quot;/gm, '"');
};
