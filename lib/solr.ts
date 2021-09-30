import * as querystring from 'querystring';
import * as JSONStream from 'JSONStream';
import * as duplexer from 'duplexer';
import { Query } from './query';
import { Collection } from './collection';
import * as versionUtils from './utils/version';
import {
  FullSolrClientParams,
  JsonResponseData,
  ResourceOptions,
  SolrClientParams,
  UndiciRequestOptions,
} from './types';
import { Duplex } from 'stream';
import { request } from 'undici';

const oldRequest = require('request');
const format = require('./utils/format');
const JSONbig = require('json-bigint');

/**
 * Pick appropriate JSON serializer/deserializer library based on the given `bigint` flag
 *
 * @param bigint
 *   Whether to handle big numbers correctly or not.
 *   The reason for not using JSONbig all the times is it has a significant performance cost.
 *
 * @return
 *   JSON or JSONbig serializer/deserializer
 */
function pickJSON(bigint: boolean): typeof JSON | typeof JSONbig {
  return bigint ? JSONbig : JSON;
}

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
      // TODO: Change type of options.request
      // request: options.request || null,
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
   *
   * @returns
   *   Parsed JSON response data.
   */
  private async doRequest(
    path: string,
    method: 'GET' | 'POST',
    body: string | null,
    bodyContentType: string | null,
    acceptContentType: string
  ): Promise<JsonResponseData> {
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

    // TODO: undici does not throw an error on certain status codes, this leaves that to us?
    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(`Request HTTP error ${response.statusCode}: ${text}`);
    }

    return pickJSON(this.options.bigint).parse(text);
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
   * @param queryParameters
   *   Query parameters to include in the URL.
   */
  add(
    docs: Record<string, any> | Record<string, any>[],
    queryParameters?: Record<string, any>
  ): Promise<JsonResponseData> {
    // format `Date` object into string understood by Solr as a date.
    docs = format.dateISOify(docs);
    docs = Array.isArray(docs) ? docs : [docs];
    return this.update(docs, queryParameters);
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
   */
  realTimeGet(
    ids: string | string[],
    query: Query | Record<string, any> | string = {}
  ): Promise<JsonResponseData> {
    ids = Array.isArray(ids) ? ids : [ids];

    if (typeof query === 'object') {
      query['ids'] = ids.join(',');
    }

    return this.doQuery(this.REAL_TIME_GET_HANDLER, query);
  }

  /**
   * Add the remote resource located at the given path `options.path` into
   * the Solr database.
   */
  addRemoteResource(options: ResourceOptions): Promise<JsonResponseData> {
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
    return this.doQuery(handler, query);
  }

  /**
   * Create a writable/readable `Stream` to add documents into the Solr database.
   */
  createAddStream(options: Record<string, any> = {}): Duplex {
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
    const postRequest = oldRequest(optionsRequest);
    jsonStreamStringify.pipe(postRequest);
    return duplexer(jsonStreamStringify, postRequest);
  }

  /**
   * Commit last added and removed documents, that means your documents are now indexed.
   */
  commit(options: Record<string, any>): Promise<JsonResponseData> {
    return this.update({
      commit: options || {},
    });
  }

  /**
   * Call Lucene's IndexWriter.prepareCommit, the changes won't be visible in the index.
   */
  prepareCommit(): Promise<JsonResponseData> {
    return this.update({}, { prepareCommit: true });
  }

  /**
   * Soft commit all changes
   */
  softCommit(): Promise<JsonResponseData> {
    return this.update({}, { softCommit: true });
  }

  /**
   * Delete documents based on the given `field` and `text`.
   */
  delete(
    field: string,
    text: string,
    options?: Record<string, any>
  ): Promise<JsonResponseData> {
    return this.update(
      {
        delete: {
          query:
            field + ':' + format.escapeSpecialChars(format.dateISOify(text)),
        },
      },
      options
    );
  }

  /**
   * Delete a range of documents based on the given `field`, `start` and `stop` arguments.
   */
  deleteByRange(
    field: string,
    start: string | Date,
    stop: string | Date,
    options?: Record<string, any>
  ): Promise<JsonResponseData> {
    start = format.dateISOify(start);
    stop = format.dateISOify(stop);
    return this.deleteByQuery(`${field}:[${start} TO ${stop}]`, options);
  }

  /**
   * Delete the document with the given `id`
   *
   * @param id
   *   ID of the document you want to delete.
   * @param options
   */
  deleteByID(
    id: string | number,
    options?: Record<string, any>
  ): Promise<JsonResponseData> {
    return this.update(
      {
        delete: {
          id: id,
        },
      },
      options
    );
  }

  /**
   * Delete documents matching the given `query`.
   */
  deleteByQuery(
    query: string,
    options?: Record<string, any>
  ): Promise<JsonResponseData> {
    return this.update(
      {
        delete: {
          query: query,
        },
      },
      options
    );
  }

  /**
   * Delete all documents.
   */
  deleteAll(options: Record<string, any>): Promise<JsonResponseData> {
    return this.deleteByQuery('*:*', options);
  }

  /**
   * Optimize the index.
   */
  optimize(options: Record<string, any>): Promise<JsonResponseData> {
    return this.update({
      optimize: options || {},
    });
  }

  /**
   * Rollback all add/delete commands made since the last commit.
   */
  rollback(): Promise<JsonResponseData> {
    return this.update({
      rollback: {},
    });
  }

  /**
   * Send an update command to the Solr server.
   *
   * @param data
   *   The data to stringify in the body.
   * @param queryParameters
   *   Query parameters to include in the URL.
   */
  update(
    data: Record<string, any>,
    queryParameters?: Record<string, any>
  ): Promise<JsonResponseData> {
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
      'application/json; charset=utf-8'
    );
  }

  /**
   * Search documents matching the `query`
   */
  search(
    query: Query | Record<string, any> | string
  ): Promise<JsonResponseData> {
    return this.doQuery(this.SELECT_HANDLER, query);
  }

  /**
   * Execute an Admin Collections task on `collection`
   */
  executeCollection(
    collection: Collection | Record<string, any> | string
  ): Promise<JsonResponseData> {
    return this.doQuery(this.COLLECTIONS_HANDLER, collection);
  }

  /**
   * Search for all documents.
   */
  searchAll(): Promise<JsonResponseData> {
    return this.search('q=*');
  }

  /**
   * Search documents matching the `query`, with spellchecking enabled.
   */
  spell(query: Query): Promise<JsonResponseData> {
    return this.doQuery(this.SPELL_HANDLER, query);
  }

  /**
   * Terms search.
   *
   * Provides access to the indexed terms in a field and the number of documents that match each term.
   */
  termsSearch(
    query: Query | Record<string, any> | string
  ): Promise<JsonResponseData> {
    return this.doQuery(this.TERMS_HANDLER, query);
  }

  /**
   * Perform an arbitrary query on a Solr handler (a.k.a. 'path').
   *
   * @param handler
   *   The name of the handler (or 'path' in Solr terminology).
   * @param query
   *   A function, Query object, Collection object, plain object, or string
   *   describing the query to perform.
   */
  doQuery(
    handler: string,
    query: Collection | Query | Record<string, any> | string
  ): Promise<JsonResponseData> {
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
      'application/json; charset=utf-8'
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
   */
  ping(): Promise<JsonResponseData> {
    return this.doQuery(this.ADMIN_PING_HANDLER, '');
  }

  /**
   * Utility only used in tests.
   *
   * @param {string} fieldName
   *   The name of the field to create.
   * @param {string} fieldType
   *   The type of field to create.
   */
  public createSchemaField(
    fieldName: string,
    fieldType: string
  ): Promise<JsonResponseData> {
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
      'application/json; charset=utf-8'
    ).catch((err) => {
      // TODO: We should handle this in a more robust way in the future, but
      //   there is a difference between default setup in Solr 5 and Solr 8,
      //   so some fields already exist in Solr 8. Hence if that's the case,
      //   we just ignore that.
      console.warn(err.message);
      return {};
    });
  }
}
