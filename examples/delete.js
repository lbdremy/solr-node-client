/**
 * Delete set of documents
 */
const solr = require('../lib/solr');

const client = solr.createClient();

const field = 'id';
const query = '*'; // Everything !Dangerous!

// Delete every documents
const obj = await client.delete(field, query)
console.log(obj);
