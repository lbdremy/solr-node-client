/**
 *
 * @param value
 * @param defaultIfNull - Will set the value to the default if it is Null or Undefined
 * @returns {*[]}
 */
exports.toArray = function toArray(value, defaultIfNull) {
  defaultIfNull = defaultIfNull || '';

  function defaultValue(value) {
    return (value === null || value === undefined) ? defaultIfNull : value;
  }

  return (Array.isArray(value)) ? value : [defaultValue(value)];
};
