/**
 * Create a stream to add documents into the database
 */
const solr = require('./../lib/solr');
const csv = require('csv-stream');
const fs = require('fs');

// Create a client
const client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

// Save all the products in the csv file into the database
fs.createReadStream(__dirname + '/materials/products.csv')
  .on('error', onerror)
  .pipe(
    csv.createStream({
      escapeChar: '"', // default is an empty string
      enclosedChar: '"', // default is an empty string
    })
  )
  .on('error', onerror)
  .pipe(client.createAddStream())
  .on('error', onerror)
  .on('end', function () {
    console.log('all products are in the database now.');
  });

// Error handler
function onerror(err) {
  console.error(err);
}
