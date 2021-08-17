const http = require('http'),
  url = require('url'),
  hasNestedProperty = require('hnp'),
  STATUS_CODES = http.STATUS_CODES;

export class HttpError extends Error {
  constructor(req: any, res: any, message: string) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    const description = STATUS_CODES[res.statusCode] || 'Unknown status code';
    req.headers = req.headers || req._headers;
    const reqHeaders = Object.keys(req.headers).map(function (name) {
      return name + ': ' + req.headers[name];
    });
    const resHeaders = Object.keys(res.headers).map(function (name) {
      return name + ': ' + res.headers[name];
    });

    let protocol = 'http';
    if (hasNestedProperty(req, 'socket.pair.ssl')) protocol = 'https';
    if (!req.uri) req.uri = protocol + '://' + req.headers['host'] + req.path;

    this.message =
      (message || '') +
      '\r\n' +
      'Request URL: ' +
      url.format(req.uri || {}) +
      '\r\n' +
      'Request method: ' +
      req.method +
      '\r\n' +
      'Status code: ' +
      res.statusCode +
      ' - ' +
      description +
      '\r\n' +
      'Request headers: \r\n' +
      reqHeaders.join('\r\n') +
      '\r\n' +
      'Response headers: \r\n' +
      resHeaders.join('\r\n') +
      (res.body ? '\r\nResponse body: \r\n' + res.body : '');
  }
}
