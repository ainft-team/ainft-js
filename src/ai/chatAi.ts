import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../ainft721Object';
import Assistants from './assistants/assistants';
import { ChatConfigureParams, TransactionResult } from '../types';
import {
  buildSetValueTransactionBody,
  validateObject,
  validateObjectOwnership,
  validateAndGetServiceName,
  validateAndGetService,
} from '../util';

export default class ChatAi {
  private ain: Ain;
  private ainize: Ainize;
  assistants: Assistants;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
    this.assistants = new Assistants(ain, ainize);
  }

  async config({
    objectId,
    provider,
    api,
  }: ChatConfigureParams): Promise<TransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwnership(appId, address, this.ain);

    const serviceName = validateAndGetServiceName(provider, api);
    await validateAndGetService(serviceName, this.ainize);

    const txBody = this.getChatConfigureTxBody(appId, serviceName);

    return this.ain.sendTransaction(txBody);
  }

  private getChatConfigureTxBody(appId: string, serviceName: string) {
    return buildSetValueTransactionBody(`/apps/${appId}/ai/${serviceName}`, {
      name: serviceName,
      type: 'chat',
      url: `https://${serviceName}.ainetwork.xyz`,
    });
  }
}
