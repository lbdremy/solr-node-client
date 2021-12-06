/**
 * Send an arbitrary HTTP GET request to Solr
 * Use case: use a Search handler exposed by Solr but not supported by this client
 * for example MoreLikeThisHandler (https://wiki.apache.org/solr/MoreLikeThisHandler)
 */
const solr = require('../lib/solr');

const client = solr.createClient();

const query = 'q=id:UTF8TEST&mlt.fl=manu,cat&mlt.mindf=1&mlt.mintf=1';
const obj = await client.doQuery('mlt', query)
console.log(obj);
