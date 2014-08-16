/**
 * Send an arbitrary HTTP GET request to Solr
 * Use case: use a Search handler exposed by Solr but not supported by this client
 * for example MoreLikeThisHandler (https://wiki.apache.org/solr/MoreLikeThisHandler)
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

var query = 'q=id:UTF8TEST&mlt.fl=manu,cat&mlt.mindf=1&mlt.mintf=1';
client.get('mlt', query, function(err, obj){
	if(err){
		console.log(err);
	}else{
		console.log(obj);
	}
});