/*!
 * Optimize: This is similar to a defrag command on a hard drive.
 * It will reorganize the index into segments (increasing search speed) and remove any deleted (replaced) documents.
 * Solr is a read only data store so every time you index a document it will mark the old document as deleted and
 * then create a brand new document to replace the deleted one. Optimize will remove these deleted documents.
 * You can see the search document vs. deleted document count by going to the Solr Statistics page and looking
 * at the numDocs vs. maxDocs numbers. The difference between the two numbers is the amount of deleted (non-search able)
 * documents in the index.
 * Also Optimize builds a whole NEW index from the old one and then switches to the new index when complete.
 * Therefore the command requires double the space to perform the action. So you will
 * need to make sure that the size of your index does not exceed %50 of your available hard drive space.
 * (This is a rule of thumb, it usually needs less then %50 because of deleted documents)
 *
 * from Stackoverflow : http://stackoverflow.com/questions/2137607/solr-commit-and-optimize-questions wrote by James Roland
 */

/**
 * Optimize Solr index.
 */

// Use `var solr = require('solr-client')` in your code
var solr = require('./../lib/solr');

var client = solr.createClient();

// You can use  `optimize` with or without options.
var options = {
   waitFlush: false ,
   waitSearcher: true
};
client.optimize(options,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
});
// waitFlush : default is true
// waitSearcher : default is true
