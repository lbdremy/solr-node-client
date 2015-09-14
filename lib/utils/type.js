/**
 *
 * @param value - The value to check against
 * @param strict - Pass true if you want to make sure the number is fully and only composed of digits, false to just check if we can extract a number via parseInt(). Default to true.
 * @returns boolean
 */
exports.isNumber = function isNumber(value, strict) {
  strict = (strict === undefined ? true : strict);
  var digitRegex = /^\-?\d+$/; // At least 1 digit, possibly a minus sign before

  if (typeof value === 'number') {
    return true;
  } else {
    // String ?
    if (strict) {
      return (('' + value).match(digitRegex) !== null);
    } else {
      return !isNaN(parseInt(value));
    }
  }
};
