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
  host: string;
  port: string | number;
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
