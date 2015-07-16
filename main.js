/*!
 * solr client
 * Copyright(c) 2011-2012 HipSnip Limited
 * Author Rémy Loubradou <remyloubradou@gmail.com>
 * MIT Licensed
 */

//module.exports = exports = require("./lib/solr");


var solr = require('./lib/new');
var client = solr.createClient({
  endpoints: ['10.64.30.11:8983', '10.64.30.12:8983'],
  core:'user'
});

var query = client.createQuery().q({email:'lli.strade@gmail.com'});

client.search(query, function(err, obj){
  console.log(err, obj);
});
