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
    
##TODO
 - Check my english
 - Support sort for queries
