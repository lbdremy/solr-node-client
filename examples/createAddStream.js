/**
 * Create a stream to add documents into the database
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');
var csv = require('csv-stream');
var fs = require('fs');

// Create a client
var client = solr.createClient();

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

// Save all the products in the csv file into the database
fs.createReadStream(__dirname + '/materials/products.csv')
    .on('error',onerror)
    .pipe(csv.createStream({
        escapeChar : '"', // default is an empty string
        enclosedChar : '"' // default is an empty string
    }))
    .on('error',onerror)
    .pipe(client.createAddStream())
    .on('error',onerror)
    .on('end',function(){
        console.log('all products are in the database now.');
    });

// Error handler
function onerror(err){
    console.error(err);
}
