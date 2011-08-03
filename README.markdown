#Solr Client API

##Get started
    // Dependency
    var solr = require('solr');
    
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

Take a look in the folder examples or [here](https://github.com/lbdremy/solr-node-client/tree/master/examples).

##Running Test
Before to run the test, start the Solr Server.
    vows --spec test/*

 

