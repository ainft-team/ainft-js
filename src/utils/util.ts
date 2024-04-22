import stringify = require('fast-json-stable-stringify');
import Ain from '@ainblockchain/ain-js';
import { SetOperation, SetMultiOperation, TransactionInput } from '@ainblockchain/ain-js/lib/types';
import * as ainUtil from '@ainblockchain/ain-util';

import { MIN_GAS_PRICE } from '../constants';
import { HttpMethod } from '../types';
import { Path } from './path';

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

export const buildSetTxBody = (
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

export const sendTx = async (ain: Ain, txBody: any) => {
  const result = await ain.sendTransaction(txBody);
  // NOTE(jiyoung): request AIN Wallet's owner to add result code.
  // ref) https://github.com/ainblockchain/ain-blockchain/blob/master/JSON_RPC_API.md#ain_sendsignedtransaction
  // if (!isTransactionSuccess(result)) {
  //   throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
  // }
  return result;
};

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
    throw new Error('Assistant not found');
  }
  return assistant;
}

export const getValue = async (ain: Ain, path: string): Promise<any> => {
  return ain.db.ref(path).getValue();
};

export const getChecksumAddress = (address: string): string => {
  return ainUtil.toChecksumAddress(address);
};

export const isJoiError = (error: any) => {
  return error.response?.data?.isJoiError === true;
};
