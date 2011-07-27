var sax = require('sax');

// Parser
var strict = true;
var parser = sax.parser(strict);


exports.report = function(html,callback) {
   var currentTag = '';
   var errorMessage = '';
   parser.onerror = function(error){
      console.log('Error', error);
      //Continue parsing
      parser.resume();
   }
   parser.ontext = function(text){
      if (currentTag === 'title'){
         errorMessage += text;
      }
   }
   parser.onopentag = function(node){
      currentTag = node.name.toLowerCase();
   }
   parser.onend = function(){
      callback(errorMessage);
   }
   parser.write(html).close();
}
