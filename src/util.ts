import stringify = require("fast-json-stable-stringify");
import { HttpMethod } from "./types";
import { DEFAULT_NETWORK } from "./constants";

export const buildData = (method: HttpMethod, path: string, timestamp: number, data: any) => {
  const _data: any = {
    method,
    path,
    timestamp
  }

  if (Object.keys(data).length === 0) {
    return _data;
  } 

  if (method === HttpMethod.POST || method  === HttpMethod.PUT) {
    _data['body'] = stringify(data);
  } else {
    _data['querystring'] = stringify(data);
  }

  return _data;
}

export const isJoiError = (error: any) => {
  return error.response?.data?.isJoiError === true;
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const getDefaultNetwork = (chain: string) => {
  return DEFAULT_NETWORK[chain] || '';
};
