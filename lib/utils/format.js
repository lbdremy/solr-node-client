/**
 * The format for date field is of the form 1995-12-31T23:59:59Z, and
 * is a more restricted form of the canonical representation of dateTime
 * http://www.w3.org/TR/xmlschema-2/#dateTime    
 * The trailing "Z" designates UTC time and is mandatory.
 * Optional fractional seconds are allowed: 1995-12-31T23:59:59.999Z
 * All other components are mandatory.
 */ 

exports.dateISOify = function(obj){
   if( obj instanceof Array ){
      for(var i = 0; i < obj.length; i++){
         if(obj[i] instanceof Object && !(obj[i] instanceof Date) ){
            for(var key in obj[i]){
               if( obj[i][key] instanceof Date ) obj[i][key] = obj[i][key].toISOString();   
            }
         }else{
            if( obj[i] instanceof Date ) obj[i] = obj[i].toISOString();
         }
      }
   }else if(obj instanceof Object && !(obj instanceof Date) ){
      for(var key in obj){
         if( obj[key] instanceof Date ) obj[key] = obj[key].toISOString();   
      }
   }else{
      if( obj instanceof Date ) obj = obj.toISOString();
   }
   return obj;
};

exports.stringify = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  obj = (obj === null) ? undefined : obj;

  switch (typeof obj) {
    case 'object':
      return Object.keys(obj).map(function(k) {
        if (Array.isArray(obj[k])) {
          return obj[k].map(function(v) {
            return stringifyPrimitive(k) +
                   eq +
                   stringifyPrimitive(v);
          }).join(sep);
        } else {
          return stringifyPrimitive(k) +
                 eq +
                 stringifyPrimitive(obj[k]);
        }
      }).join(sep);

    default:
      if (!name) return '';
      return stringifyPrimitive(name) + eq +
             stringifyPrimitive(obj);
  }
};

function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

