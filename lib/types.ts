import { Dispatcher } from 'undici';
import { TlsOptions } from 'tls';

export type UndiciRequestOptions = Omit<
  Dispatcher.RequestOptions,
  'origin' | 'path'
> & { tls?: TlsOptions };

export type ResourceOptions = {
  /**
   * Set of extras parameters pass along in the query.
   */
  parameters?: Record<string, any>;

  /**
   * Format of the resource. XML, CSV or JSON formats must be used.
   */
  format?: string;

  /**
   * Content type of the resource. E.g. 'text/plain;charset=utf-8'.
   */
  contentType?: string;

  /**
   * File path or HTTP URL to a remote resource.
   *
   * A full path or a path relative to the CWD of the running solr server must be used.
   */
  path: string;
};

export type SolrClientParams = {
  /**
   * IP address or host ame of the Solr server.
   */
  host?: string;

  /**
   * Port of the Solr server
   */
  port?: string | number;

  /**
   * Name of the Solr core to use.
   */
  core?: string;

  /**
   * Root path of all requests.
   */
  path?: string;

  /**
   * Whether to use HTTPS.
   */
  secure?: boolean;

  /**
   * Whether to use the JSONbig serializer/deserializer instead of the native
   * JSON serializer/deserializer.
   */
  bigint?: boolean;

  /**
   * TLS configuration, used for SSL
   */
  tls?: TlsOptions;

  /**
   * Custom request options to use with every request.
   */
  request?: UndiciRequestOptions | null;

  /**
   * One of [4, 6].
   * Passed to http/https lib's "family" option.
   */
  ipVersion?: number;

  /**
   * One of ['3.2', '4.0', '5.0', '5.1'].
   * Check lib/utils/version.ts for full reference.
   */
  solrVersion?: number;

  /**
   * The maximum size for which to use GET requests.
   * Requests larger than this will use POST.
   */
  get_max_request_entity_size?: boolean | number;
};

export type FullSolrClientParams = {
  host: string;
  port: string | number;
  core: string;
  path: string;
  secure: boolean;
  bigint: boolean;
  tls?: TlsOptions;
  request?: UndiciRequestOptions | null;
  ipVersion: number;
  solrVersion: number;
  get_max_request_entity_size: boolean | number;
  authorization?: string;
};

export type DateOptions = {
  field: string;
  start?: string | number | Date;
  end?: string | number | Date;
};

export type JoinOptions = {
  from: string;
  to: string;
  fromIndex: string;
  field: string;
  value: string | number | Date | boolean;
};

export type Filters = {
  field: string;
  value: string | number | Date | boolean;
};
export type GroupOptions = {
  on?: boolean;
  field?: string | string[];
  query?: Record<string, any> | Record<string, any>[];
  limit?: number;
  offset?: number;
  sort?: string;
  format?: string;
  main?: boolean;
  ngroups?: boolean;
  truncate?: boolean;
  cache?: number;
};

export type FacetOptions = {
  on?: boolean;
  query?: string;
  field: string | string[];
  prefix?: string;
  sort?: string;
  limit?: number;
  offset?: number;
  mincount?: number;
  missing?: boolean;
  method?: string;
  pivot: Pivot;
};
export type Pivot = {
  mincount?: number;
  fields;
};

export type MltOptions = {
  on?: boolean;
  fl?: string | string[];
  count?: number;
  mintf?: number;
  mindf?: number;
  minwl?: number;
  maxwl?: number;
  maxqt?: number;
  maxntp?: number;
  boost?: boolean;
  qf?: string | number | Record<string, any>;
};

export type HlOptions = {
  on?: boolean;
  q?: Record<string, any> | string;
  qparser?: string;
  fl?: Record<string, any> | string;
  snippets?: number;
  fragsize?: number;
  mergeContiguous?: boolean;
  maxAnalyzedChars?: number;
  maxMultiValuedToExamine?: number;
  maxMultiValuedToMatch?: number;
  alternateField?: string;
  maxAlternateFieldLength?: number;
  formatter?: string;
  simplePre?: string;
  simplePost?: string;
  fragmenter?: string;
  highlightMultiTerm?: boolean;
  requireFieldMatch?: boolean;
  usePhraseHighlighter?: boolean;
  regexSlop?: number;
  regexPattern?: string;
  regexMaxAnalyzedChars?: number;
  preserveMulti?: boolean;
  payloads?: boolean;
};

export type TermsOptions = {
  on?: boolean;
  fl: string;
  lower?: string;
  lowerIncl?: boolean;
  mincount?: number;
  maxcount?: number;
  prefix?: string;
  regex?: string;
  regexFlag?: string;
  limit?: number;
  upper?: string;
  upperIncl?: boolean;
  raw?: boolean;
  sort?: string;
};

export type CreateOptions = {
  name: string;
  routerName?: string;
  numShards?: number;
  shards?: string | string[];
  replicationFactor?: number;
  maxShardsPerNode?: number;
  createNodeSet?: string | string[];
  createNodeSetShuffle?: boolean;
  collectionConfigName?: string;
  routerField?: string;
  autoAddReplicas?: boolean;
  async?: string;
};

export type SplitShard = {
  collection: string;
  shard: string;
  ranges?: string | string[];
  splitKey?: string;
  async?: string;
};
export type ShardOptions = {
  collection: string;
  shard: string;
};

export type Alias = {
  name: string;
  collections: string | string[];
};

export type DeleteReplica = {
  collection: string;
  shard: string;
  replica: string;
  onlyIfDown: boolean;
};

export type AddReplica = {
  collection?: string;
  shard?: string;
  route?: string;
  node?: string;
  async?: string;
};

export type ClusterProp = {
  name?: string;
  val?: string | boolean | number;
};

export type Migrate = {
  collection: string;
  targetCollection: string;
  splitKey: string;
  forwardTimeout?: number;
  async?: string;
};

export type Role = {
  role: string;
  node: string;
};

export type AddReplicaProp = {
  collection: string;
  shard: string;
  replica: string;
  property: string;
  propertyValue: string | boolean | number;
  shardUnique?: boolean;
};

export type DeleteReplicaProp = {
  collection: string;
  shard: string;
  replica: string;
  property: string;
};

export type BalanceShardUnique = {
  collection: string;
  property: string;
  onlyActiveNodes?: boolean;
  shardUnique?: boolean;
};

export type RebalanceLeaders = {
  collection: string;
  maxAtOnce?: number;
  maxWaitSeconds?: number;
};

export type AddResponse = {
  adds: any[];
  responseHeader: {
    status: number;
    QTime: number;
  };
};

export type JsonResponseData = Record<string, any> | any[];
export type CommonResponse = {
  responseHeader: Record<string, any>;
};

export type MatchFilterOption = {
  complexPhrase: boolean;
};
