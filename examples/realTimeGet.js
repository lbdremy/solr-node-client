/**
 * Use real-time get feature
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

// Retrieve only one document
var id = 3973873;
client.realTimeGet(id, function(err, obj){
    if(err){
        console.log(err);
    }else{
        console.log(obj);
    }
});

// Retrieve multiple documents
var ids = [
    4874847,
    9449747,
    949448
];
client.realTimeGet(ids, function(err, obj){
    if(err){
        console.log(err);
    }else{
        console.log(obj);
    }
});

