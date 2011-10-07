/**
 * The format for date field is of the form 1995-12-31T23:59:59Z, and
 * is a more restricted form of the canonical representation of dateTime
 * http://www.w3.org/TR/xmlschema-2/#dateTime    
 * The trailing "Z" designates UTC time and is mandatory.
 * Optional fractional seconds are allowed: 1995-12-31T23:59:59.999Z
 * All other components are mandatory.
 */
 
exports.toSolrDateFormat = function toSolrDateFormat(date){
   // Extract
   var year = date.getUTCFullYear();
   var month = date.getUTCMonth() + 1;
   var day = date.getUTCDate();
   var hour = date.getUTCHours();
   var minutes = date.getUTCMinutes();
   var seconds = date.getUTCSeconds();
   var milliseconds = date.getUTCMilliseconds();
   
   // Standardize
   month = standardize(month);
   day = standardize(day);
   hour = standardize(hour);
   minutes = standardize(minutes);
   seconds = standardize(seconds);
   
   // Format
   var formatedDate = year + '-' + month + '-' + day + 'T' + hour + ':' + minutes + ':' + seconds + '.' + milliseconds + 'Z';
   
   return formatedDate;
}

function standardize(number){
 return number.toString().length === 1 ?  '0' + number : number;
}
