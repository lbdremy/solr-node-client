/**
 * Expose `dateISOify()` and `toISOString()`
 */

exports.dateISOify = dateISOify;
exports.toISOString = toISOString;

/**
 * ISOify `Date` objects (possibly in collections)
 *
 * @param {Array|Object} obj
 *
 * @return {Array|Object}
 * @api private
 */

function dateISOify(obj){
   if( obj instanceof Array ){
      for(var i = 0; i < obj.length; i++){
         obj[i] = dateISOify(obj[i]);
      }
   }else if(obj instanceof Object && !(obj instanceof Date) ){
      for(var key in obj){
         if( obj[key] instanceof Date ) obj[key] = toISOString(obj[key]);
      }
   }else{
      if( obj instanceof Date ) obj = toISOString(obj);
   }
   return obj;
};

/**
 * ISOify a single `Date` object
 * Sidesteps `Invalid Date` objects by returning `null` instead
 *
 * @param {Date}
 *
 * @return {null|String}
 * @api private
 */
function toISOString(date) {
   return (date && !isNaN(date.getTime())) ? date.toISOString() : null;
};

/**
 * Expose `stringify()`
 */

exports.stringify = stringify;

/**
 * Serialize an object to a string. Optionally override the default separator ('&') and assignment ('=') characters.
 *
 * @param {Object} obj - object to serialiaze
 * @param {String} [sep] - separator character
 * @param {String} [eq] - assignment character
 * @param {String} [name] -
 *
 * @return {String}
 * @api private
 */

function stringify(obj, sep, eq, name) {
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

/**
 * Stringify a primitive
 *
 * @param {String|Boolean|Number} v - primitive value
 *
 * @return {String}
 * @api private
 */
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

/**
 * Expose `escapeSpecialChars`
 */

 exports.escapeSpecialChars = escapeSpecialChars;

 /**
  * Escape special characters that are part of the query syntax of Lucene
  *
  * @param {String} s - string to escape
  *
  * @return {String}
  * @api public
  */

function escapeSpecialChars(s){
  return s.replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\])/g, function(match) {
    return '\\' + match;
  })
  .replace(/&&/g, '\\&\\&')
  .replace(/\|\|/g, '\\|\\|');
}
