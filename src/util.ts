import stringify = require('fast-json-stable-stringify');
import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import {
  SetOperation,
  TransactionInput,
} from '@ainblockchain/ain-js/lib/types';
import Service from '@ainize-team/ainize-js/dist/service';

import { MIN_GAS_PRICE } from './constants';
import { HttpMethod } from './types';

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

export const buildSetTransactionBody = (
  operation: SetOperation
): TransactionInput => {
  return {
    operation: operation,
    gas_price: MIN_GAS_PRICE,
    nonce: -1,
  };
};

export const isJoiError = (error: any) => {
  return error.response?.data?.isJoiError === true;
};

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function serializeEndpoint(endpoint: string) {
  return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
}

export function isTransactionSuccess(transactionResponse: any) {
  const { result } = transactionResponse;
  if (result.code && result.code !== 0) {
    return false;
  }

  if (result.result_list) {
    const results = Object.values(result.result_list);
    return results.every((_result: any) => _result.code === 0);
  }

  return true;
}

export const BlockchainPath = {
  app: (appId: string): any => {
    return {
      root: () => `/apps/${appId}`,
      ai: () => `${BlockchainPath.app(appId).root()}/ai`,
      token: (tokenId: string) =>
        `${BlockchainPath.app(appId).root()}/tokens/${tokenId}`,
    };
  },
};

export const getServiceName = (
  provider: string,
  api: string
): string | undefined => {
  const key = `${provider}-${api}`;
  return serviceName.get(key);
};

// TODO(jiyoung): update service name after deployment of ainize service.
const serviceName = new Map<string, string>([
  ['openai-assistants', 'ainize_test14' /*'ainize-openai-assistants-service'*/],
]);

export const validateObject = async (appId: string, ain: Ain) => {
  const appPath = BlockchainPath.app(appId).root();
  if (!(await exists(appPath, ain))) {
    throw new Error('AINFT object not found');
  }
};

export const validateObjectOwnership = async (
  appId: string,
  address: string,
  ain: Ain
) => {
  const appPath = BlockchainPath.app(appId).root();
  const app = await getValue(appPath, ain);
  if (address !== app.owner) {
    throw new Error(`${address} is not AINFT object owner`);
  }
};

export const validateServiceName = (provider: string, api: string): string => {
  const serviceName = getServiceName(provider, api);
  if (!serviceName) {
    throw new Error('Service not found');
  }
  return serviceName;
};

export const validateService = async (
  name: string,
  ainize: Ainize
): Promise<Service> => {
  const service = await ainize.getService(name);
  if (!service.isRunning()) {
    throw new Error('Service is not running');
  }
  return service;
};

export const validateAi = async (
  appId: string,
  serviceName: string,
  ain: Ain
) => {
  const aiPath = `${BlockchainPath.app(appId).ai()}/${serviceName}`;
  if (!(await exists(aiPath, ain))) {
    throw new Error('AI is not configured');
  }
};

export const validateToken = async (
  appId: string,
  tokenId: string,
  ain: Ain
) => {
  const tokenPath = BlockchainPath.app(appId).token(tokenId);
  if (!(await exists(tokenPath, ain))) {
    throw new Error('Token not found');
  }
};

const exists = async (path: string, ain: Ain): Promise<boolean> => {
  return !!(await ain.db.ref(path).getValue());
};

const getValue = async (path: string, ain: Ain): Promise<any> => {
  return ain.db.ref(path).getValue();
};
