// Modules dependencies
var date = require('./date');

function format(param){
   if( param instanceof Date ){
      param = date.toSolrDateFormat(param);
   }
   return param;
}   

exports.friendlyze = function friendlyze(params){
   if( params instanceof Array ){
      for(var i = 0; i < params.length; i++){
         if(params[i] instanceof Object && !(params[i] instanceof Date) ){
            for( key in params[i]){
               params[i][key] = format(params[i][key]);   
            }
         }else{
            params[i] = format(params[i]);
         }
      }
   }else if(params instanceof Object && !(params instanceof Date) ){
      for( key in params){
         params[key] = format(params[key]);   
      }
   }else{
      params = format(params);
   }
   return params;
};

