import SdkBase from '../sdkBase';
import Assistants from './assistants/assistants';
import { ChatConfigureParams, TransactionResult } from '../types';
import Ainft721Object from '../ainft721Object';
import {
  BlockchainPathMap,
  getAinizeServiceName,
  buildSetTransactionBody,
} from '../util';

export default class Chat extends SdkBase {
  assistants: Assistants = new Assistants(this.ain, this.ainize);

  async config({
    ainftObjectId,
    provider,
    api,
  }: ChatConfigureParams): Promise<TransactionResult> {
    const appId = Ainft721Object.getAppId(ainftObjectId);
    const appPath = BlockchainPathMap.app(appId).root();
    const app = await this.ain.db.ref(appPath).getValue();
    if (!app) {
      throw new Error('AINFT object not found');
    }

    const address = this.ain.signer.getAddress();
    if (address !== app.owner) {
      throw new Error(`${address} is not AINFT object owner`);
    }

    const serviceName = getAinizeServiceName({ provider, api });
    if (!serviceName) {
      throw new Error('Service not found');
    }

    const service = await this.ainize.getService(serviceName);
    if (!service.isRunning()) {
      throw new Error('Service is not running');
    }

    const txBody = buildSetTransactionBody({
      type: 'SET_VALUE',
      ref: `/apps/${appId}/ai/${serviceName}`,
      value: {
        name: serviceName,
        type: 'chat',
        provider: provider,
        api: api,
        url: `https://${serviceName}.ainetwork.xyz`,
      },
    });

    const result = await this.ain.sendTransaction(txBody);
    // TODO(jiyoung): return transaction status into user-friendly format.
    return { txHash: result.tx_hash };
  }
}
