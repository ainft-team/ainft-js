import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../ainft721Object';
import Assistants from './assistants/assistants';
import Threads from './threads/threads';
import AinizeAuth from '../auth/ainizeAuth';
import {
  ChatConfigureParams,
  CreditDepositTransactionResult,
  TransactionResult,
} from '../types';
import {
  buildSetValueTransactionBody,
  validateObject,
  validateObjectOwnership,
  validateAndGetAiName,
  validateAndGetAiService,
  Ref,
} from '../util';

export default class ChatAi {
  private ain: Ain;
  private ainize: Ainize;
  assistants: Assistants;
  threads: Threads;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
    this.assistants = new Assistants(ain, ainize);
    this.threads = new Threads(ain, ainize);
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

    const aiName = validateAndGetAiName(provider, api);
    await validateAndGetAiService(aiName, this.ainize);

    const txBody = this.getChatConfigureTxBody(appId, aiName);

    return this.ain.sendTransaction(txBody);
  }

  async depositCredit(
    provider: string,
    api: string,
    amount: number
  ): Promise<CreditDepositTransactionResult> {
    const address = this.ain.signer.getAddress();

    const aiName = validateAndGetAiName(provider, api);
    const aiService = await validateAndGetAiService(aiName, this.ainize);

    // TODO(jiyoung): update login method to use signer. (if implemented)
    await AinizeAuth.getInstance().login(this.ain, this.ainize);
    const currentBalance = await aiService.getCreditBalance();
    const txHash = await aiService.chargeCredit(amount);
    const updatedBalance = await this.waitForBalanceUpdate(
      currentBalance + amount,
      60 * 1000, // 1 min
      aiService
    );
    await AinizeAuth.getInstance().logout(this.ainize);

    return { tx_hash: txHash, address, balance: updatedBalance };
  }

  withdrawCredit(): never {
    throw new Error('Not implemented');
  }

  private async waitForBalanceUpdate(
    expectedBalance: number,
    timeout: number,
    service: Service
  ) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const balance = await service.getCreditBalance();
      if (balance === expectedBalance) {
        return balance;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 sec
    }
    throw new Error('AI credit update failed');
  }

  private getChatConfigureTxBody(appId: string, aiName: string) {
    const aiRef = Ref.app(appId).ai(aiName);
    return buildSetValueTransactionBody(aiRef, {
      name: aiName,
      type: 'chat',
      url: `https://${aiName}.ainetwork.xyz`,
    });
  }
}
