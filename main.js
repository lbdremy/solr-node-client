/*!
 * solr client
 * Copyright(c) 2011-2012 HipSnip Limited
 * Author Rémy Loubradou <remyloubradou@gmail.com>
 * MIT Licensed
 */

//module.exports = exports = require("./lib/solr");


var test = require('./lib/solr');
var client1 = test.createClient({
  endpoints: ['10.64.30.11:8983', '10.64.30.12:8983'],
  core:'user'
});

var query1 = client1.createQuery().q({email:'lli.strade@gmail.com'});

client1.search(query1, function(err, obj){
  console.log(err, obj);
});

// var solr = require('./lib/solr');
// var client2 = solr.createClient({
//   host: '10.64.30.12',
//   core: 'user'
// });
// var query2= client2.createQuery().q({email:'lli.strade@gmail.com'});

// client2.search(query2, function(err, obj){
//   console.log(err, obj);
// });
