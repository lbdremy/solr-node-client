import { JsonResponseData } from '../types';
import { pickJSON } from './utils';

/*
import { Dispatcher } from 'undici';
export type UndiciRequestOptions = Omit<
  Dispatcher.RequestOptions,
  'origin' | 'path'
  >;
*/

export type HttpClient = {
  doRequest: <T = JsonResponseData>(
    path: string,
    method: 'GET' | 'POST',
    body: string | null,
    bodyContentType: string | null,
    acceptContentType: string
  ) => Promise<T>
}

let httpClient: HttpClient

function createAxiosClient() {
  async function doRequest<T = JsonResponseData>(
    path: string,
    method: 'GET' | 'POST',
    body: string | null,
    bodyContentType: string | null,
    acceptContentType: string
  ): Promise<T> {
    throw new Error('not implemented')
  }

  return {
    doRequest
  }
}

/*
function createUndiciClient() {
  const { request } = require('undici');


 */
  /**
   * Common function for all HTTP requests.
   *
   * @param path
   *   Full URL for the request.
   * @param method
   *   HTTP method, like "GET" or "POST".
   * @param body
   *   Optional data for the request body.
   * @param bodyContentType
   *   Optional content type for the request body.
   * @param acceptContentType
   *   The expected content type of the response.
   *
   * @returns
   *   Parsed JSON response data.
   */
  /*
  async function doRequest<T = JsonResponseData>(
    path: string,
    method: 'GET' | 'POST',
    body: string | null,
    bodyContentType: string | null,
    acceptContentType: string
  ): Promise<T> {
    const protocol = this.options.secure ? 'https' : 'http';
    const url = `${protocol}://${this.options.host}:${this.options.port}${path}`;
    const requestOptions: UndiciRequestOptions = {
      ...this.options.request,
      method,
    };

// Now set options that the user should not be able to override.
    if (!requestOptions.headers) {
      requestOptions.headers = {};
    }
    requestOptions.headers['accept'] = acceptContentType;
    if (method === 'POST') {
      if (bodyContentType) {
        requestOptions.headers['content-type'] = bodyContentType;
      }
      if (body) {
        requestOptions.headers['content-length'] = Buffer.byteLength(body);
        requestOptions.body = body;
      }
    }
    if (this.options.authorization) {
      requestOptions.headers['authorization'] = this.options.authorization;
    }

// Perform the request and handle results.
    const response = await request(url, requestOptions);

// Always consume the response body. See https://github.com/nodejs/undici#garbage-collection
    const text = await response.body.text();

// Undici does not throw an error on certain status codes, this leaves that to us
    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(`Request HTTP error ${response.statusCode}: ${text}`);
    }

    return pickJSON(this.options.bigint).parse(text);
  }

  return {
    doRequest
  }
}
*/

if (typeof window === 'undefined') {
  //httpClient = createUndiciClient()
} else {
  httpClient = createAxiosClient()
}

export { httpClient }
