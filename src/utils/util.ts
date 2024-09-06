import stringify = require('fast-json-stable-stringify');
import Ain from '@ainblockchain/ain-js';
import {
  SetOperation,
  SetMultiOperation,
  TransactionInput,
  GetOptions,
} from '@ainblockchain/ain-js/lib/types';
import * as ainUtil from '@ainblockchain/ain-util';

import { MIN_GAS_PRICE } from '../constants';
import { HttpMethod } from '../types';
import { Path } from './path';
import { AinftError } from '../error';

export const buildData = (
  method: HttpMethod,
  path: string,
  timestamp: number,
  data?: Record<string, any>
) => {
  const _data: any = {
    method,
    path,
    timestamp,
  };

  if (!data || Object.keys(data).length === 0) {
    return _data;
  }

  if (method === HttpMethod.POST || method === HttpMethod.PUT) {
    _data['body'] = stringify(data);
  } else {
    _data['querystring'] = stringify(data);
  }

  return _data;
};

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function serializeEndpoint(endpoint: string) {
  return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
}

export const valueExists = async (ain: Ain, path: string): Promise<boolean> => {
  return !!(await ain.db.ref(path).getValue());
};

export const getAssistant = async (ain: Ain, appId: string, tokenId: string) => {
  // TODO(jiyoung): fix circular reference with Ainft721Object.getAppId.
  // const appId = AinftObject.getAppId(objectId);
  const assistantPath = Path.app(appId).token(tokenId).ai().value();
  const assistant = await getValue(ain, assistantPath);
  if (!assistant) {
    throw new AinftError('not-found', `assistant not found: ${appId}(${tokenId})`);
  }
  return assistant;
};

export const getToken = async (ain: Ain, appId: string, tokenId: string) => {
  const tokenPath = Path.app(appId).token(tokenId).value();
  const token = await getValue(ain, tokenPath);
  if (!token) {
    throw new AinftError('not-found', `token not found: ${appId}(${tokenId})`);
  }
  return token;
};

export const getValue = async (ain: Ain, path: string, options?: GetOptions): Promise<any> => {
  return ain.db.ref().getValue(path, options);
};

export const getChecksumAddress = (address: string): string => {
  return ainUtil.toChecksumAddress(address);
};

export const isJoiError = (error: any) => {
  return error.response?.data?.isJoiError === true;
};
