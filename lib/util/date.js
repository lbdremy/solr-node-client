function standardize(number){
 return number.toString().length === 1 ?  '0' + number : number;
}

exports.toSolrDateFormat = function toSolrDateFormat(date){
   // Extract
   var year = date.getFullYear();
   var month = date.getMonth() + 1;
   var day = date.getDate();
   var hour = date.getHours();
   var minutes = date.getMinutes();
   var seconds = date.getSeconds();
   var milliseconds = date.getMilliseconds();
   
   // Standardize
   month = standardize(month);
   day = standardize(day);
   hour = standardize(hour);
   minutes = standardize(minutes);
   seconds = standardize(seconds);
   
   // Format
   var formatedDate = year + '-' + month + '-' + day + 'T' + hour + ':' + minutes + ':' + seconds + ':' + milliseconds + 'Z';
   
   return formatedDate;
}
