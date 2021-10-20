/**
 * Delete all documents
 */
const solr = require('../lib/solr');

const client = solr.createClient();

const obj = await client.deleteAll();
console.log(obj);
// Do not forget to commit now
// to see the changes
