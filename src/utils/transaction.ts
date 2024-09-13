import Ain from '@ainblockchain/ain-js';
import { TransactionInput, SetOperation, SetMultiOperation } from '@ainblockchain/ain-js/lib/types';
import { MIN_GAS_PRICE, TX_BYTES_LIMIT } from '../constants';
import { AinftError } from '../error';

export const buildSetValueOp = (ref: string, value: any): SetOperation => ({
  type: 'SET_VALUE',
  ref,
  value,
});

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

export const buildSetWriteRuleOp = (ref: string, rule: any) => buildSetRuleOp(ref, { write: rule });

export const buildSetStateRuleOp = (ref: string, rule: any) => buildSetRuleOp(ref, { state: rule });

export const buildSetOp = (opList: SetOperation[]): SetMultiOperation => ({
  type: 'SET',
  op_list: opList,
});

export const buildSetTxBody = (
  operation: SetOperation | SetMultiOperation,
  address: string
): TransactionInput => ({
  operation,
  address,
  gas_price: MIN_GAS_PRICE,
  nonce: -1,
});

export const isTxSizeValid = (txBody: TransactionInput) => {
  const text = JSON.stringify(txBody);
  const size = new TextEncoder().encode(text).length;
  return size <= TX_BYTES_LIMIT;
};

export const isTxSuccess = (txResult: any) => {
  const { result } = txResult;
  if (result.code && result.code !== 0) {
    return false;
  }
  if (result.result_list) {
    const results = Object.values(result.result_list);
    return results.every((_result: any) => _result.code === 0);
  }
  return true;
};

export const sendTx = async (txBody: TransactionInput, ain: Ain) => {
  if (!isTxSizeValid(txBody)) {
    throw new AinftError(
      'payload-too-large',
      `transaction exceeds size limit: ${TX_BYTES_LIMIT} bytes`
    );
  }
  const result = await ain.sendTransaction(txBody);
  if (!isTxSuccess(result)) {
    console.error(JSON.stringify(result, null, 2));
    throw new AinftError('internal', `failed to send transaction: ${result.tx_hash}`);
  }
  return result;
};
