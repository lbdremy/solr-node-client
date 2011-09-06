#Solr Client API

##Features
 - Support commands: Query, Delete, Update, Commit, Rollback, Optimize
 - Support Dismax Query Syntax
 - Support implicit conversion for `Date` Object to the supported format by Solr.
 More informations available about [the Solr Date Format](http://lucidworks.lucidimagination.com/display/LWEUG/Solr+Date+Format).
 
##Install
    npm install solr-client
    
##Get started
    // Dependency
    var solr = require('solr-client');
    
    //Create Client
    var client = solr.createClient();
    
    //Add
    var doc = {
      field : 'value';
    }
    var callback = function(json,err){
      if(err) console.log(err);
      if(json) console.log(json);
    }
    client.add(doc,callback);
    client.commit(callback);

##Examples

Take a look in the folder examples/[here](https://github.com/lbdremy/solr-node-client/tree/master/examples).

##Running Test
Before to run the test, start the Solr Server.
    vows --spec test/*

 

