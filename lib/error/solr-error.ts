/**
 * Module dependencies
 */
import { HttpError } from './http-error';

export class SolrError extends HttpError {
  public statusCode: any;
  constructor(req, res, htmlMessage) {
    super(req, res, htmlMessage);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    let message = '';
    if (htmlMessage) {
      const matches = htmlMessage.match(/<pre>([\s\S]+)<\/pre>/);
      message = decode((matches || ['', htmlMessage])[1].trim());
    }
    this.statusCode = res.statusCode;
    this.message = message ?? res.statusMessage;
  }
}
/**
 * Decode few HTML entities: &<>'"
 *
 * @param {String} str -
 *
 * @return {String}
 * @api private
 */
function decode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/gm, '<')
    .replace(/&gt;/gm, '>')
    .replace(/&apos;/gm, "'")
    .replace(/&quot;/gm, '"');
}
