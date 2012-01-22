// Expose Solr error constructor
module.exports = SolrError;

// Solr Error
function SolrError(statusCode,htmlMessage){
   Error.call(this);
   Error.captureStackTrace(this,arguments.callee);
   this.name = 'SolrError';
   var errorReason = '';
   if(htmlMessage){
      var matches = htmlMessage.match(/<pre>([\s\S]+)<\/pre>/);
      errorReason = decode((matches || ['', htmlMessage])[1].trim());
   }
   this.message = 'HTTP status ' + statusCode + '.Reason: ' + errorReason;
}

SolrError.prototype.__proto__ = Error.prototype;

// Decode few HTML entities: &<>'"
function decode(str) {
  return str.replace(/&amp;/g,'&')
            .replace(/&lt;/gm, '<')
            .replace(/&gt;/gm, '>')
            .replace(/&apos;/gm, '\'')
            .replace(/&quot;/gm, '"');
};
