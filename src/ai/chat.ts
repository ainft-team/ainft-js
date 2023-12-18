import SdkBase from '../sdkBase';
import Ainft721Object from '../ainft721Object';
import Assistants from './assistants/assistants';
import { ChatConfigureParams, TransactionResult } from '../types';
import {
  buildSetTransactionBody,
  validateObject,
  validateObjectOwnership,
  validateService,
  validateServiceName,
} from '../util';

export default class Chat extends SdkBase {
  assistants: Assistants = new Assistants(this.ain, this.ainize);

  async config({
    objectId,
    provider,
    api,
  }: ChatConfigureParams): Promise<TransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwnership(appId, address, this.ain);

    const serviceName = validateServiceName(provider, api);
    const service = await validateService(serviceName, this.ainize);

    const txBody = buildSetTransactionBody({
      type: 'SET_VALUE',
      ref: `/apps/${appId}/ai/${serviceName}`,
      value: {
        name: serviceName,
        type: 'chat',
        url: `https://${serviceName}.ainetwork.xyz`,
      },
    });

    const result = await this.ain.sendTransaction(txBody);
    // TODO(jiyoung): return transaction status into user-friendly format.
    return { txHash: result.tx_hash };
  }
}
