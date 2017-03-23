var QueryBuilder = module.exports = function () {
  this.query = [];
};

QueryBuilder.prototype.where = function (field, val, opt) {
  var prefix = '';

  if (!this._ignoreNextWherePrefix && this.query.length) {
    prefix =  (opt && opt.operator) || 'AND ';
  }

  delete this._ignoreNextWherePrefix;

  this._buildingWhere = true;

  this.query.push(prefix + field + ':');

  if (val) this.equals(val);

  return this;
};

QueryBuilder.prototype._ensureIsBuildingWhere = function (method) {
  if (!this._buildingWhere) {
    var msg = method + '() must be used after where() when called with these arguments';
    throw new Error(msg);
  }
};

QueryBuilder.prototype.equals = function equals (val, opt) {
  this._ensureIsBuildingWhere('equals');

  if (typeof val === 'string'){
    if (opt && opt.contains) val = '*' + val + '*';
    val = quote(val);
  }
  this.query.push(val);
  this._buildingWhere = false;  return this;
};

QueryBuilder.prototype.in = function equals (values, separator) {
  this._ensureIsBuildingWhere('in');

  if (!Array.isArray(values)) values = values.split(separator || ',');


  values = values.map(function (val) {
    return typeof val === 'string' ? quote(val) : val;
  });

  this.query.push('(' + values.join(' ') + ')');

  this._buildingWhere = false;
  return this;
};

QueryBuilder.prototype.begin = function equals () {
  this._ignoreNextWherePrefix = true;
  this.query.push('(');
  return this;
};

QueryBuilder.prototype.end = function equals () {
  this.query.push(')');
  return this;
};

QueryBuilder.prototype.or = function equals () {
  this._ignoreNextWherePrefix = true;
  this.query.push(' OR ');
  return this;
};

QueryBuilder.prototype.any = function equals (conditions, opt) {
  this.begin();

  var first = true;
  for (var field in conditions) {
    if (first) first = false; else this.or();

    this.where(field).equals(conditions[field], opt);
  }

  this.end();

  return this;
};

QueryBuilder.prototype.between = function equals (start, end, method) {
  this._ensureIsBuildingWhere('between' || method);

  if (arguments.length !== 2) throw new Error('method between() must receive 2 arguments');

  if (!start) start = '*';
  if (!end) end = '*';

  this.query.push('[' + start + ' TO ' + end + ']');

  this._buildingWhere = false;
  return this;
};

QueryBuilder.prototype.lt = function equals (val) {
  return this.between(null, val);
};

QueryBuilder.prototype.gt = function equals (val) {
  return this.between(val, null);
};

QueryBuilder.prototype.build = function () {
  return this.query.length ? this.query.join(' ') : '*:*';
};

function quote (value) {
  return '"' + value + '"';
}