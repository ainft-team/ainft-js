import stringify = require("fast-json-stable-stringify");
import { HttpMethod } from "./types";

export const buildData = (method: HttpMethod, path: string, timestamp: number, data?: Record<string, any>) => {
  const _data: any = {
    method,
    path,
    timestamp
  }

  if (!data || Object.keys(data).length === 0) {
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

export function serializeEndpoint(endpoint: string) {
  return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
}

type TransactionResult = {
  code?: number;
  result_list?: {
    [index: string]: { code: number };
  }
}

type TransactionResponse = {
  result: TransactionResult
  tx_hash: string;
}

export function isSuccessTransaction(transactionResponse: TransactionResponse) {
  const result = transactionResponse.result;
  if (result.code !== undefined) {
    return isSuccessOperation(result);
  } else if (result.result_list) {
    const resultList = Object.values(result.result_list);
    return resultList.every((_operationResult) => isSuccessOperation(_operationResult));
  }

  return false;
}

function isSuccessOperation(result: TransactionResult) {
  return result.code === 0;
}