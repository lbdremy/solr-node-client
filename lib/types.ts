import type { Agent as HttpAgent} from 'http';
import type { Agent as HttpsAgent} from 'https';

export type CallbackFn = (error: Error, result: any) => void;

export type ResourceOptions = {
  parameters?: Record<string, any>;
  format?: string;
  contentType?: string;
  path: string;
};

export type SolrRequestParams = {
  host: string;
  port: string | number;
  core?: string;
  authorization?: string;
  fullPath: string;
  secure: boolean;
  bigint: boolean;
  agent?: HttpAgent | HttpsAgent;
  request?: Record<string, any> | null;
  ipVersion: number;
  params?: string;
};

export type SolrClientParams = {
  host?: string;
  port?: string | number;
  core?: string;
  path?: string
  secure?: boolean;
  bigint?: boolean;
  agent?: HttpAgent | HttpsAgent;
  request?: Record<string, any> | null;
  ipVersion?: number;
  solrVersion?: number
  get_max_request_entity_size?: boolean | number
}

export type FullSolrClientParams = {
  host: string;
  port: string | number;
  core: string;
  path: string
  secure: boolean;
  bigint: boolean;
  agent?: HttpAgent | HttpsAgent;
  request?: Record<string, any> | null;
  ipVersion: number;
  solrVersion: number
  get_max_request_entity_size: boolean | number
  authorization?: string
}

export type DateOptions = {
  field: string
  start: string | number | Date
  end: string | number | Date
}

export type Filters = {
  field: string
  value: string | number | Date | boolean
}
export type GroupOptions = {
  on?: boolean
  field?: string | string[]
  query?: Record<string, any> | Record<string, any>[]
  limit?: number
  offset?: number
  sort?: string
  format?: string
  main?: boolean
  ngroups?: boolean
  truncate?: boolean
  cache?: number
}

export type FacetOptions = {
  on?: boolean
  query?: string
  field: string | string[]
  prefix?: string
  sort?: string
  limit?: number
  offset?: number
  mincount?: number
  missing?: boolean
  method?: string
  pivot: Pivot
}
export type Pivot = {
  mincount?: string
  fields
}

export type MltOptions = {
  on?: boolean
  fl?: string | Record<string, any>[]
  count?: number
  mintf?: number
  mindf?: number
  minwl?: number
  maxwl?: number
  maxqt?: number
  maxntp?: number
  boost?: boolean
  qf?: string | Record<string, any>
}

export type HlOptions = {
  on?: boolean
  q?: Record<string, any>
  qparser?: string
  fl?: Record<string, any>
  snippets?: number
  fragsize?: number
  mergeContiguous?: boolean
  maxAnalyzedChars?: number
  maxMultiValuedToExamine?: number
  maxMultiValuedToMatch?: number
  alternateField?: string
  maxAlternateFieldLength?: number
  formatter?: string
  simplePre?: string
  simplePost?: string
  fragmenter?: string
  highlightMultiTerm?: boolean
  requireFieldMatch?: boolean
  usePhraseHighlighter?: boolean
  regexSlop?: number
  regexPattern?: string
  regexMaxAnalyzedChars?: number
  preserveMulti?: boolean
  payloads?: boolean
}

export type TermsOptions = {
  on?: boolean
  fl: string
  lower?: string
  lowerIncl?: boolean
  mincount?: number
  maxcount?: number
  prefix?: string
  regex?: string
  regexFlag?: string
  limit?: number
  upper?: string
  upperIncl?: boolean
  raw?: boolean
  sort?: string
}