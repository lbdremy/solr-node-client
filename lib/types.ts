import http from 'http';

export type CallbackFn = (
  error: Error,
  result: any
) => void

export type Options = {
  parameters: Record<string, any>,
  format: string
  contentType: string,
  path: string
}

export type Params = {
  host: string,
  port: string | number,
  core?: string,
  authorization: string,
  fullPath: string,
  secure: boolean,
  bigint: boolean,
  agent: any,
  request: Record<string, any>
  ipVersion: number
  params?: string
}