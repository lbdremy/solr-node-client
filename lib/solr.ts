import type { RequestOptions } from 'http';
import { ClientRequest } from 'http';
import * as querystring from 'querystring';
import * as JSONStream from 'JSONStream';
import * as duplexer from 'duplexer';
import { Query } from './query';
import { Collection } from './collection';
import * as versionUtils from './utils/version';
import {
  CallbackFn,
  FullSolrClientParams,
  ResourceOptions,
  SolrClientParams,
} from './types';

const request = require('request');
const bluebird = require('bluebird');
const format = require('./utils/format');
const { handleJSONResponse, pickJSON, pickProtocol } = require('./client');

export function createClient(options: SolrClientParams = {}) {
  return new Client(options);
}

/**
 * Solr client.
 */
export class Client {
  private readonly options: FullSolrClientParams;
  private readonly UPDATE_JSON_HANDLER: string;
  private readonly UPDATE_HANDLER: string;
  private readonly TERMS_HANDLER: string;
  private readonly SPELL_HANDLER: string;
  private readonly REAL_TIME_GET_HANDLER: string;
  private readonly ADMIN_PING_HANDLER: string;
  private readonly COLLECTIONS_HANDLER: string;
  private readonly SELECT_HANDLER: string;

  constructor(options: SolrClientParams = {}) {
    this.options = {
      host: options.host || '127.0.0.1',
      port: options.port === 0 ? 0 : options.port || '8983',
      core: options.core || '',
      path: options.path || '/solr',
      agent: options.agent,
      secure: options.secure || false,
      bigint: options.bigint || false,
      get_max_request_entity_size: options.get_max_request_entity_size || false,
      solrVersion: options.solrVersion || versionUtils.Solr3_2,
      ipVersion: options.ipVersion == 6 ? 6 : 4,
      request: options.request || null,
    };

    // Default paths of all request handlers
    this.UPDATE_JSON_HANDLER =
      versionUtils.version(this.options.solrVersion) >= versionUtils.Solr4_0
        ? 'update'
        : 'update/json';
    this.UPDATE_HANDLER = 'update';
    this.SELECT_HANDLER = 'select';
    this.COLLECTIONS_HANDLER = 'admin/collections';
    this.ADMIN_PING_HANDLER = 'admin/ping';
    this.REAL_TIME_GET_HANDLER = 'get';
    this.SPELL_HANDLER = 'spell';
    this.TERMS_HANDLER = 'terms';
  }

  get solrVersion(): number {
    return this.options.solrVersion;
  }

  /**
   * Construct the full path to the given "handler".
   *
   * @param handler
   *   Relative URL path for the solr handler.
   *
   * @returns
   *   Full URL to the handler.
   */
  private getFullHandlerPath(handler: string): string {
    let pathArray;
    if (handler === this.COLLECTIONS_HANDLER) {
      pathArray = [this.options.path, handler];
    } else {
      pathArray = [this.options.path, this.options.core, handler];
    }
    return pathArray.filter((e) => e).join('/');
  }

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
   * @param callback
   *   The function to call when done.
   */
  private doRequest(
    path: string,
    method: string,
    body: string | null,
    bodyContentType: string | null,
    acceptContentType: string,
    callback?: CallbackFn
  ): ClientRequest {
    const requestOptions: RequestOptions = {
      host: this.options.host,
      port: this.options.port,
      headers: {},
      family: this.options.ipVersion,

      // Allow these to override (not merge with) previous values.
      ...this.options.request,

      method,
      path,
    };

    // Now set options that the user should not be able to override.
    if (!requestOptions.headers) {
      requestOptions.headers = {};
    }
    requestOptions.headers.accept = acceptContentType;
    if (method === 'POST') {
      if (bodyContentType) {
        requestOptions.headers['content-type'] = bodyContentType;
      }
      if (body) {
        requestOptions.headers['content-length'] = Buffer.byteLength(body);
      }
    }
    if (this.options.authorization) {
      requestOptions.headers.authorization = this.options.authorization;
    }
    if (this.options.agent) {
      requestOptions.agent = this.options.agent;
    }

    // Perform the request and handle results.
    const request = pickProtocol(this.options.secure).request(requestOptions);
    request.on(
      'response',
      handleJSONResponse(request, this.options.bigint, callback)
    );
    request.on('error', function onError(err) {
      if (callback) {
        callback(err, null);
      }
    });
    if (body) {
      request.write(body);
    }
    request.end();
    return request;
  }

  /**
   * Create credential using the basic access authentication method
   */
  basicAuth(username: string, password: string): Client {
    this.options.authorization =
      'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    return this;
  }

  /**
   * Remove authorization header
   */
  unauth(): Client {
    delete this.options.authorization;
    return this;
  }

  /**
   * Add a document or a list of documents.
   *
   * @param docs
   *   Document or list of documents to add into the Solr database.
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  add(
    docs: Record<string, any> | Record<string, any>[],
    options?: Record<string, any> | CallbackFn,
    callback?: CallbackFn
  ): ClientRequest {
    if (typeof options === 'function') {
      callback = options as CallbackFn;
      options = {};
    }
    docs = format.dateISOify(docs); // format `Date` object into string understable for Solr as a date.
    docs = Array.isArray(docs) ? docs : [docs];
    return this.update(docs, options, callback);
  }

  /**
   * Updates a document or a list of documents.
   *
   * This function is a clone of `add` and it was added to give more clarity on the availability of atomic updates.
   */
  atomicUpdate = Client.prototype.add;

  /**
   * Get a document by id or a list of documents by ids using the Real-time-get feature
   *  in SOLR4 (https://wiki.apache.org/solr/RealTimeGet)
   *
   * @param ids
   *   ID or list of IDs that identify the documents to get.
   * @param query
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  realTimeGet(
    ids: string | string[],
    query?: Query | Record<string, any> | string,
    callback?: CallbackFn
  ): ClientRequest {
    if (typeof query === 'function') {
      callback = query as CallbackFn;
    }
    if (!query) {
      query = {};
    }
    ids = Array.isArray(ids) ? ids : [ids];

    if (typeof query === 'object') {
      query['ids'] = ids.join(',');
    }

    return this.doQuery(this.REAL_TIME_GET_HANDLER, query, callback);
  }

  /**
   * Add the remote resource located at the given path `options.path` into the Solr database.
   *
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  addRemoteResource(
    options: ResourceOptions,
    callback: CallbackFn
  ): ClientRequest {
    options.parameters = options.parameters || {};
    options.format = options.format === 'xml' ? '' : options.format || ''; // reason: the default route of the XmlUpdateRequestHandle is /update and not /update/xml.
    options.parameters.commit =
      options.parameters.commit === undefined
        ? false
        : options.parameters.commit;
    options.parameters['stream.contentType'] =
      options.contentType || 'text/plain;charset=utf-8';
    if (options.path.match(/^https?:\/\//)) {
      options.parameters['stream.url'] = options.path;
    } else {
      options.parameters['stream.file'] = options.path;
    }

    const handler = this.UPDATE_HANDLER + '/' + options.format.toLowerCase();
    const query = querystring.stringify(options.parameters);
    return this.doQuery(handler, query, callback);
  }

  /**
   * Create a writable/readable `Stream` to add documents into the Solr database.
   */
  createAddStream(options: Record<string, any>) {
    const path = [
      this.options.path,
      this.options.core,
      this.UPDATE_JSON_HANDLER +
        '?' +
        querystring.stringify({ ...options, wt: 'json' }),
    ]
      .filter(function (element) {
        return element;
      })
      .join('/');
    const headers = {
      'content-type': 'application/json',
      charset: 'utf-8',
    };
    if (this.options.authorization) {
      headers['authorization'] = this.options.authorization;
    }
    const protocol = this.options.secure ? 'https' : 'http';
    const optionsRequest = {
      url:
        protocol + '://' + this.options.host + ':' + this.options.port + path,
      method: 'POST',
      headers: headers,
    };
    const jsonStreamStringify = JSONStream.stringify();
    const postRequest = request(optionsRequest);
    jsonStreamStringify.pipe(postRequest);
    return duplexer(jsonStreamStringify, postRequest);
  }

  /**
   * Commit last added and removed documents, that means your documents are now indexed.
   *
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  commit(
    options: Record<string, any> | CallbackFn,
    callback: CallbackFn
  ): ClientRequest {
    if (typeof options === 'function') {
      callback = options as CallbackFn;
      options = {};
    }
    const data = {
      commit: options || {},
    };
    return this.update(data, callback);
  }

  /**
   * Call Lucene's IndexWriter.prepareCommit, the changes won't be visible in the index.
   *
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  prepareCommit(callback: CallbackFn): ClientRequest {
    return this.update({}, { prepareCommit: true }, callback);
  }

  /**
   * Soft commit all changes
   *
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  softCommit(callback: CallbackFn): ClientRequest {
    return this.update({}, { softCommit: true }, callback);
  }

  /**
   * Delete documents based on the given `field` and `text`.
   *
   * @param field
   * @param text
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  delete(
    field: string,
    text: string,
    options?: Record<string, any> | CallbackFn,
    callback?: CallbackFn
  ): ClientRequest {
    if (typeof options === 'function') {
      callback = options as CallbackFn;
      options = {};
    }
    text = format.dateISOify(text);
    const data = {
      delete: {
        query: field + ':' + format.escapeSpecialChars(text),
      },
    };
    return this.update(data, options, callback);
  }

  /**
   * Delete a range of documents based on the given `field`, `start` and `stop` arguments.
   *
   * @param field
   * @param start
   * @param stop
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  deleteByRange(
    field: string,
    start: string | Date,
    stop: string | Date,
    options?: Record<string, any> | CallbackFn,
    callback?: CallbackFn
  ): ClientRequest {
    if (typeof options === 'function') {
      callback = options as CallbackFn;
      options = {};
    }
    start = format.dateISOify(start);
    stop = format.dateISOify(stop);

    const query = field + ':[' + start + ' TO ' + stop + ']';
    return this.deleteByQuery(query, options, callback);
  }

  /**
   * Delete the document with the given `id`
   *
   * @param id
   *   ID of the document you want to delete.
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  deleteByID(
    id: string | number,
    options?: Record<string, any> | CallbackFn,
    callback?: CallbackFn
  ): ClientRequest {
    if (typeof options === 'function') {
      callback = options as CallbackFn;
      options = {};
    }
    const data = {
      delete: {
        id: id,
      },
    };
    return this.update(data, options, callback);
  }

  /**
   * Delete documents matching the given `query`.
   *
   * @param query
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  deleteByQuery(
    query: string,
    options?: Record<string, any> | CallbackFn,
    callback?: CallbackFn
  ): ClientRequest {
    if (typeof options === 'function') {
      callback = options as CallbackFn;
      options = {};
    }
    const data = {
      delete: {
        query: query,
      },
    };
    return this.update(data, options, callback);
  }

  /**
   * Delete all documents.
   *
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  deleteAll(
    options: Record<string, any> | CallbackFn,
    callback: CallbackFn
  ): ClientRequest {
    return this.deleteByQuery('*:*', options, callback);
  }

  /**
   * Optimize the index.
   *
   * @param options
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  optimize(
    options: Record<string, any> | CallbackFn,
    callback: CallbackFn
  ): ClientRequest {
    if (typeof options === 'function') {
      callback = options as CallbackFn;
      options = {};
    }
    const data = {
      optimize: options || {},
    };
    return this.update(data, callback);
  }

  /**
   * Rollback all add/delete commands made since the last commit.
   *
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  rollback(callback: CallbackFn): ClientRequest {
    const data = {
      rollback: {},
    };
    return this.update(data, callback);
  }

  /**
   * Send an update command to the Solr server.
   *
   * @param data
   *   The data to stringify in the body.
   * @param queryParameters
   *   Query parameters to include in the URL.
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  update(
    data: Record<string, any>,
    queryParameters?: Record<string, any> | CallbackFn,
    callback?: any
  ): ClientRequest {
    if (typeof queryParameters === 'function') {
      callback = queryParameters;
      queryParameters = {};
    }

    const path = this.getFullHandlerPath(this.UPDATE_JSON_HANDLER);
    const queryString = querystring.stringify({
      ...queryParameters,
      wt: 'json',
    });

    return this.doRequest(
      `${path}?${queryString}`,
      'POST',
      pickJSON(this.options.bigint).stringify(data),
      'application/json',
      'application/json; charset=utf-8',
      callback
    );
  }

  /**
   * Search documents matching the `query`
   *
   * @param query
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  search(
    query: Query | Record<string, any> | string,
    callback: CallbackFn
  ): ClientRequest {
    return this.doQuery(this.SELECT_HANDLER, query, callback);
  }

  /**
   * Execute an Admin Collections task on `collection`
   *
   * @param {Query|Object|String} collection
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  executeCollection(
    collection: Collection | Record<string, any> | string,
    callback: CallbackFn
  ): ClientRequest {
    return this.doQuery(this.COLLECTIONS_HANDLER, collection, callback);
  }

  /**
   * Search for all documents.
   *
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  searchAll(callback: CallbackFn): ClientRequest {
    return this.search('q=*', callback);
  }

  /**
   * Search documents matching the `query`, with spellchecking enabled.
   *
   * @param query
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  spell(query: Query, callback: CallbackFn): ClientRequest {
    return this.doQuery(this.SPELL_HANDLER, query, callback);
  }

  /**
   * Terms search.
   *
   * Provides access to the indexed terms in a field and the number of documents that match each term.
   *
   * @param query
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  termsSearch(
    query: Query | Record<string, any> | string,
    callback: CallbackFn
  ) {
    return this.doQuery(this.TERMS_HANDLER, query, callback);
  }

  /**
   * Perform an arbitrary query on a Solr handler (a.k.a. 'path').
   *
   * @param handler
   *   The name of the handler (or 'path' in Solr terminology).
   * @param query
   *   A function, Query object, Collection object, plain object, or string
   *   describing the query to perform.
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  doQuery(
    handler: string,
    query: Collection | Query | Record<string, any> | string,
    callback: CallbackFn | undefined
  ): ClientRequest {
    // Construct the string to use as query (GET) or body (POST).
    let data: string;
    if (query instanceof Query || query instanceof Collection) {
      data = query.build();
    } else if (typeof query === 'object') {
      data = querystring.stringify(query);
    } else {
      // query is a string.
      data = query;
    }

    const path = this.getFullHandlerPath(handler);
    const queryString = data ? data + '&wt=json' : 'wt=json';

    // Decide whether to use GET or POST, based on the length of the data.
    // 10 accounts for protocol and special characters like ://, port colon,
    // initial slash, etc.
    const approxUrlLength =
      10 +
      Buffer.byteLength(this.options.host) +
      this.options.port.toString().length +
      Buffer.byteLength(path) +
      1 +
      Buffer.byteLength(queryString);
    const method =
      this.options.get_max_request_entity_size === false ||
      approxUrlLength <= this.options.get_max_request_entity_size
        ? 'GET'
        : 'POST';

    return this.doRequest(
      method === 'GET' ? `${path}?${queryString}` : path,
      method,
      method === 'POST' ? data : null,
      method === 'POST'
        ? 'application/x-www-form-urlencoded; charset=utf-8'
        : null,
      'application/json; charset=utf-8',
      callback
    );
  }

  /**
   * Create an instance of `Query`
   */
  query(): Query {
    return new Query(this.options);
  }

  /**
   * Create an instance of `Collection`.
   */
  collection(): Collection {
    return new Collection();
  }

  /**
   * Expose `format.escapeSpecialChars` from `Client.escapeSpecialChars`
   */
  escapeSpecialChars = format.escapeSpecialChars;

  /**
   * Ping the Solr server.
   *
   * @param callback
   *   A function to execute when the Solr server responds or an error occurs.
   */
  ping(callback: CallbackFn) {
    return this.doQuery(this.ADMIN_PING_HANDLER, '', callback);
  }

  /**
   * Utility only used in tests.
   *
   * @param {string} fieldName
   *   The name of the field to create.
   * @param {string} fieldType
   *   The type of field to create.
   * @param {Function} cb
   *   A callback to run when completed.
   */
  public createSchemaField(
    fieldName: string,
    fieldType: string,
    cb: CallbackFn
  ): ClientRequest {
    return this.doRequest(
      this.getFullHandlerPath('schema'),
      'POST',
      pickJSON(this.options.bigint).stringify({
        'add-field': {
          name: fieldName,
          type: fieldType,
          multiValued: false,
          stored: true,
        },
      }),
      'application/json',
      'application/json; charset=utf-8',
      (err, data) => {
        if (err) {
          // TODO: We should handle this in a more robust way in the future, but
          //   there is a difference between default setup in Solr 5 and Solr 8,
          // so some fields already exist in Solr 8. Hence if that's the case, we
          // just ignore that.
          console.warn(err.message);
        }
        cb(undefined, data);
      }
    );
  }
}

bluebird.promisifyAll(Client.prototype);
