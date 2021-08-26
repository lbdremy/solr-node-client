import { DateOptions } from '../types';

export function dateISOify(obj: Record<string, Date>): Record<string, string>
export function dateISOify(obj: Date[]): string[]
export function dateISOify (obj: DateOptions  | DateOptions[]): DateOptions | DateOptions[]
export function dateISOify (obj: string | number | Date | boolean): string

  /**
 * ISOify `Date` objects (possibly in collections)
 * @api private
 */
export function dateISOify(obj: any | any[]): any | any[] {
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = dateISOify(obj[i]);
    }
  } else if (obj instanceof Object && !(obj instanceof Date)) {
    for (const key in obj) {
      if (obj[key] instanceof Date) obj[key] = toISOString(obj[key] as any) as any;
    }
  } else {
    if (obj instanceof Date) {
      obj = toISOString(obj) as any;
    }
  }
  return obj;
}

/**
 * ISOify a single `Date` object
 * Sidesteps `Invalid Date` objects by returning `null` instead
 * @api private
 */
export function toISOString(date: Date): string | null {
  return date && !isNaN(date.getTime()) ? date.toISOString() : null;
}

/**
 * Serialize an object to a string. Optionally override the default separator ('&') and assignment ('=') characters.
 *
 * @param {Object} obj - object to serialize
 * @param {String} [sep] - separator character
 * @param {String} [eq] - assignment character
 * @param {String} [name] -
 *
 * @return {String}
 * @api private
 */

export function stringify(obj: Record<string, any> | null | undefined, sep?: string, eq?: string, name?: string): string {
  sep = sep || '&';
  eq = eq || '=';
  obj = obj === null ? undefined : obj;

  if (typeof obj === 'object') {
    return Object.keys(obj)
      .map(function (k) {
        if (Array.isArray(obj![k])) {
          return obj![k]
            .map(function (v) {
              return stringifyPrimitive(k) + eq + stringifyPrimitive(v);
            })
            .join(sep);
        } else {
          return stringifyPrimitive(k) + eq + stringifyPrimitive(obj![k]);
        }
      })
      .join(sep);
  }

    if (!name) return '';
    return stringifyPrimitive(name) + eq + stringifyPrimitive(obj);
}

/**
 * Stringify a primitive
 * @api private
 */
function stringifyPrimitive(v: string | boolean | number | undefined): string {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v.toString() : '';

    default:
      return '';
  }
}

/**
 * Escape special characters that are part of the query syntax of Lucene
 * @api public
 */
export function escapeSpecialChars(s: string): string {
  return s
    .replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\\/])/g, function (match) {
      return '\\' + match;
    })
    .replace(/&&/g, '\\&\\&')
    .replace(/\|\|/g, '\\|\\|');
}
