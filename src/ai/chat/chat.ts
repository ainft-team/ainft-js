import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../../ainft721Object';
import Assistants from '../assistants/assistants';
import Threads from '../threads/threads';
import AinizeAuth from '../../auth/ainizeAuth';
import {
  ChatConfigureParams,
  CreditDepositTransactionResult,
  TransactionResult,
} from '../../types';
import {
  buildSetTransactionBody,
  buildSetValueOp,
  Ref,
  sleep,
  validateAndGetAiName,
  validateAndGetAiService,
  validateObject,
  validateObjectOwner,
} from '../../util';

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

  async configure({ objectId, provider, api }: ChatConfigureParams): Promise<TransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAndGetAiService(aiName, this.ainize);

    const txBody = this.buildTxBodyForConfigureChat(appId, aiName, address);
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

    // TODO(jiyoung): use signer for login method if implemented.
    await AinizeAuth.getInstance().login(this.ain, this.ainize);
    const currentBalance = await aiService.getCreditBalance();
    const txHash = await aiService.chargeCredit(amount);
    const updatedBalance = await this.waitForCreditUpdate(
      currentBalance + amount,
      60 * 1000,
      aiService
    );
    await AinizeAuth.getInstance().logout(this.ainize);

    return { tx_hash: txHash, address, balance: updatedBalance };
  }

  // TODO(jiyoung): use types/interface.
  async getCredit(provider: string, api: string): Promise<number> {
    const aiName = validateAndGetAiName(provider, api);
    const aiService = await validateAndGetAiService(aiName, this.ainize);

    // TODO(jiyoung): split code block into method.
    // TODO(jiyoung): use signer for login method if implemented.
    await AinizeAuth.getInstance().login(this.ain, this.ainize);
    const balance = await aiService.getCreditBalance();
    await AinizeAuth.getInstance().logout(this.ainize);

    return balance;
  }

  private async waitForCreditUpdate(expectedBalance: number, timeout: number, service: Service) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const balance = await service.getCreditBalance();
      if (balance === expectedBalance) {
        return balance;
      }
      await sleep(5 * 1000);
    }
    throw new Error('Credit update failed');
  }

  private buildTxBodyForConfigureChat(appId: string, aiName: string, address: string) {
    const ref = Ref.app(appId).ai(aiName);
    const config = {
      name: aiName,
      type: 'chat',
      url: `https://${aiName}.ainetwork.xyz`,
    };
    const setValueOp = buildSetValueOp(ref, config);
    return buildSetTransactionBody(setValueOp, address);
  }
}
