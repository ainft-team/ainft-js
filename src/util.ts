import stringify = require('fast-json-stable-stringify');
import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import {
  SetOperation,
  TransactionInput,
} from '@ainblockchain/ain-js/lib/types';
import Service from '@ainize-team/ainize-js/dist/service';

import { PROVIDER_API_AI_NAME_MAP, MIN_GAS_PRICE } from './constants';
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

export const buildSetValueTransactionBody = (ref: string, value: any) => {
  return buildSetTransactionBody({
    type: 'SET_VALUE',
    ref: ref,
    value: value,
  });
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

export const Ref = {
  app: (appId: string): AppRef => {
    return {
      root: () => `/apps/${appId}`,
      ai: (aiName: string) => `${Ref.app(appId).root()}/ai/${aiName}`,
      token: (tokenId: string): TokenRef => {
        return {
          root: () => `${Ref.app(appId).root()}/tokens/${tokenId}`,
          ai: (aiName: string): TokenAiRef => {
            return {
              root: () =>
                `${Ref.app(appId).token(tokenId).root()}/ai/${aiName}`,
              config: () =>
                `${Ref.app(appId).token(tokenId).ai(aiName).root()}/config`,
              history: (address: string): HistoryRef => {
                return {
                  root: () =>
                    `${Ref.app(appId)
                      .token(tokenId)
                      .ai(aiName)
                      .root()}/history/${address}`,
                  thread: (threadId: string): ThreadRef => {
                    return {
                      root: () =>
                        `${Ref.app(appId)
                          .token(tokenId)
                          .ai(aiName)
                          .history(address)
                          .root()}/threads/${threadId}`,
                      message: (messageId: string) =>
                        `${Ref.app(appId)
                          .token(tokenId)
                          .ai(aiName)
                          .history(address)
                          .thread(threadId)}/messages/${messageId}`,
                    };
                  },
                };
              },
            };
          },
        };
      },
    };
  },
};

type AppRef = {
  root: () => string;
  ai: (aiName: string) => string;
  token: (tokenId: string) => TokenRef;
};

type TokenRef = {
  root: () => string;
  ai: (aiName: string) => TokenAiRef;
};

type TokenAiRef = {
  root: () => string;
  config: () => string;
  history: (address: string) => HistoryRef;
};

type HistoryRef = {
  root: () => string;
  thread: (threadId: string) => ThreadRef;
};

type ThreadRef = {
  root: () => string;
  message: (messageId: string) => string;
};

export const validateAndGetAiName = (provider: string, api: string): string => {
  const key = `${provider}-${api}`;
  const aiName = PROVIDER_API_AI_NAME_MAP.get(key);
  if (!aiName) {
    throw new Error('AI service not supported');
  }
  return aiName;
};

export const validateObject = async (appId: string, ain: Ain) => {
  const appPath = Ref.app(appId).root();
  if (!(await exists(appPath, ain))) {
    throw new Error('AINFT object not found');
  }
};

export const validateObjectOwnership = async (
  appId: string,
  address: string,
  ain: Ain
) => {
  const appPath = Ref.app(appId).root();
  const app = await getValue(appPath, ain);
  if (address !== app.owner) {
    throw new Error(`${address} is not AINFT object owner`);
  }
};

export const validateAndGetAiService = async (
  aiName: string,
  ainize: Ainize
): Promise<Service> => {
  const service = await ainize.getService(aiName);
  if (!service.isRunning()) {
    throw new Error('AI service is not running');
  }
  return service;
};

export const validateAi = async (appId: string, aiName: string, ain: Ain) => {
  const aiPath = Ref.app(appId).ai(aiName);
  if (!(await exists(aiPath, ain))) {
    throw new Error('AI not configured');
  }
};

export const validateAndGetTokenAi = async (
  appId: string,
  tokenId: string,
  aiName: string,
  aiId: string | null,
  ain: Ain
) => {
  const tokenAiPath = Ref.app(appId).token(tokenId).ai(aiName).root();
  const tokenAi = await getValue(tokenAiPath, ain);
  if (!tokenAi) {
    throw new Error('Token AI not found');
  }
  if (aiId && tokenAi.id !== aiId) {
    throw new Error(`Incorrect token AI(${tokenAi.object}) ID`);
  }
  return tokenAi;
};

export const validateToken = async (
  appId: string,
  tokenId: string,
  ain: Ain
) => {
  const tokenPath = Ref.app(appId).token(tokenId).root();
  if (!(await exists(tokenPath, ain))) {
    throw new Error('Token not found');
  }
};

export const exists = async (path: string, ain: Ain): Promise<boolean> => {
  return !!(await ain.db.ref(path).getValue());
};

export const getValue = async (path: string, ain: Ain): Promise<any> => {
  return ain.db.ref(path).getValue();
};
