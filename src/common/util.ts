import stringify = require('fast-json-stable-stringify');
import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import { SetOperation, SetMultiOperation, TransactionInput } from '@ainblockchain/ain-js/lib/types';
import Service from '@ainize-team/ainize-js/dist/service';

import AinizeAuth from './ainizeUtil';
import { SERVICE_NAME_MAP, MIN_GAS_PRICE } from '../constants';
import { HttpMethod, JobType, MessageMap } from '../types';

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
  operation: SetOperation | SetMultiOperation,
  address: string
): TransactionInput => {
  return {
    operation: operation,
    address,
    gas_price: MIN_GAS_PRICE,
    nonce: -1,
  };
};

export const buildSetValueOp = (ref: string, value: any): SetOperation => ({
  type: 'SET_VALUE',
  ref,
  value,
});

export const buildSetWriteRuleOp = (ref: string, rule: any) => buildSetRuleOp(ref, { write: rule });

export const buildSetStateRuleOp = (ref: string, rule: any) => buildSetRuleOp(ref, { state: rule });

export const buildSetRuleOp = (ref: string, rule: { write?: any; state?: any }): SetOperation => ({
  type: 'SET_RULE',
  ref,
  value: {
    '.rule': {
      write: rule.write,
      state: rule.state,
    },
  },
});

export const buildSetOp = (opList: any[]): SetMultiOperation => ({
  type: 'SET',
  op_list: opList,
});

export const sendTransaction = (txBody: any, ain: Ain) => {
  return ain.sendTransaction(txBody);
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
              root: () => `${Ref.app(appId).token(tokenId).root()}/ai/${aiName}`,
              config: () => `${Ref.app(appId).token(tokenId).ai(aiName).root()}/config`,
              history: (address: string): HistoryRef => {
                return {
                  root: () =>
                    `${Ref.app(appId).token(tokenId).ai(aiName).root()}/history/${address}`,
                  thread: (threadId: string): ThreadRef => {
                    return {
                      root: () =>
                        `${Ref.app(appId)
                          .token(tokenId)
                          .ai(aiName)
                          .history(address)
                          .root()}/threads/${threadId}`,
                      messages: () =>
                        `${Ref.app(appId)
                          .token(tokenId)
                          .ai(aiName)
                          .history(address)
                          .root()}/threads/${threadId}/messages`,
                      message: (messageId: string) =>
                        `${Ref.app(appId)
                          .token(tokenId)
                          .ai(aiName)
                          .history(address)
                          .thread(threadId)
                          .root()}/messages/${messageId}`,
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
  messages: () => string;
  message: (messageId: string) => string;
};

export const validateObject = async (appId: string, ain: Ain) => {
  const appPath = Ref.app(appId).root();
  if (!(await exists(appPath, ain))) {
    throw new Error('AINFT object not found');
  }
};

export const validateObjectOwner = async (appId: string, address: string, ain: Ain) => {
  const appPath = Ref.app(appId).root();
  const app = await getValue(appPath, ain);
  if (address !== app.owner) {
    throw new Error(`${address} is not AINFT object owner`);
  }
};

export const validateAndGetServiceName = async (name: string, ainize: Ainize): Promise<string> => {
  const serviceName = SERVICE_NAME_MAP.get(name);
  if (serviceName) return serviceName;
  const service = await ainize.getService(name);
  if (!service) throw new Error(`Unknown service name: ${name}`);
  return name;
};

export const validateService = async (serviceName: string, ainize: Ainize): Promise<void> => {
  await validateAndGetService(serviceName, ainize);
};

export const validateAndGetService = async (
  serviceName: string,
  ainize: Ainize
): Promise<Service> => {
  const service = await ainize.getService(serviceName);
  if (!service.isRunning()) {
    throw new Error('Service is currently not running');
  }
  return service;
};

export const validateServiceConfiguration = async (
  appId: string,
  serviceName: string,
  ain: Ain
) => {
  const aiPath = Ref.app(appId).ai(serviceName);
  if (!(await exists(aiPath, ain))) {
    throw new Error('Service configuration not found. Please call `ainft.chat.configure()` first.');
  }
};

export const validateAssistant = async (
  appId: string,
  tokenId: string,
  serviceName: string,
  assistantId: string | null,
  ain: Ain
) => {
  const assistant = await validateAndGetAssistant(appId, tokenId, serviceName, ain);
  if (assistantId && assistantId !== assistant.id) {
    throw new Error(`Incorrect assistant ID`);
  }
};

export const validateAndGetAssistant = async (
  appId: string,
  tokenId: string,
  serviceName: string,
  ain: Ain
) => {
  const assistantPath = Ref.app(appId).token(tokenId).ai(serviceName).root();
  const assistant = await getValue(assistantPath, ain);
  if (!assistant) {
    throw new Error('Assistant not found');
  }
  return assistant;
};

export const validateAssistantNotExists = async (
  appId: string,
  tokenId: string,
  serviceName: string,
  ain: Ain
) => {
  const assistantPath = Ref.app(appId).token(tokenId).ai(serviceName).root();
  const exists = await getValue(assistantPath, ain);
  if (exists) {
    throw new Error('Assistant already exists');
  }
};

export const validateToken = async (appId: string, tokenId: string, ain: Ain) => {
  const tokenPath = Ref.app(appId).token(tokenId).root();
  if (!(await exists(tokenPath, ain))) {
    throw new Error('Token not found');
  }
};

export const validateThread = async (
  appId: string,
  tokenId: string,
  serviceName: string,
  address: string,
  threadId: string,
  ain: Ain
) => {
  const threadPath = Ref.app(appId)
    .token(tokenId)
    .ai(serviceName)
    .history(address)
    .thread(threadId)
    .root();

  if (!(await exists(threadPath, ain))) {
    throw new Error('Thread not found');
  }
};

export const validateMessage = async (
  appId: string,
  tokenId: string,
  serviceName: string,
  address: string,
  threadId: string,
  messageId: string,
  ain: Ain
) => {
  const messagesPath = Ref.app(appId)
    .token(tokenId)
    .ai(serviceName)
    .history(address)
    .thread(threadId)
    .messages();
  const messages: MessageMap = await getValue(messagesPath, ain);
  // TODO(jiyoung): optimize inefficient loop.
  for (const key in messages) {
    if (messages[key].id === messageId) {
      return;
    }
  }
  throw new Error('Message not found');
};

export const exists = async (path: string, ain: Ain): Promise<boolean> => {
  return !!(await ain.db.ref(path).getValue());
};

export const getValue = async (path: string, ain: Ain): Promise<any> => {
  return ain.db.ref(path).getValue();
};

export const ainizeLogin = async (ain: Ain, ainize: Ainize) => {
  return AinizeAuth.getInstance().login(ain, ainize);
};

export const ainizeLogout = async (ainize: Ainize) => {
  return AinizeAuth.getInstance().logout(ainize);
};

export const sendAinizeRequest = async <T>(
  jobType: JobType,
  body: object,
  service: Service,
  ain: Ain,
  ainize: Ainize
): Promise<T> => {
  let timeout: NodeJS.Timeout | null = null;
  try {
    await ainizeLogin(ain, ainize);
    const timeoutPromise = new Promise(
      (_, reject) => (timeout = setTimeout(() => reject(new Error('timeout')), 60000)) // 1min
    );
    const response = await Promise.race([service.request({ ...body, jobType }), timeoutPromise]);
    if (response.status === 'FAIL') {
      throw new Error(JSON.stringify(response.data));
    }
    return response.data as T;
  } catch (error: any) {
    throw new Error(`Ainize service request failed: ${error.message}`);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
    await ainizeLogout(ainize);
  }
};
