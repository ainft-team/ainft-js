import stringify = require('fast-json-stable-stringify');
import { HttpMethod, ServiceKey } from './types';
import {
  SetOperation,
  TransactionInput,
} from '@ainblockchain/ain-js/lib/types';
import { MIN_GAS_PRICE } from './constants';

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

export const BlockchainPathMap = {
  app: (appId: string): any => {
    return {
      root: () => `/apps/${appId}`,
      aiConfig: (serviceName: string) =>
        `${BlockchainPathMap.app(appId).root()}/ai/${serviceName}`,
    };
  },
};

// TODO(jiyoung): update service name after ainize deployment.
const ainizeServiceName = new Map<string, string>([
  ['openai-assistants', 'ainize_test14' /*'ainize-openai-assistants-service'*/],
]);

export const getAinizeServiceName = ({ provider, api }: ServiceKey) => {
  const mapKey = `${provider}-${api}`;
  return ainizeServiceName.get(mapKey);
};
