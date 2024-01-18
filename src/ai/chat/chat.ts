import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../../ainft721Object';
import Assistants from '../assistants/assistants';
import Threads from '../threads/threads';
import {
  ChatConfigureParams,
  CreditDepositTransactionResult,
  TransactionResult,
} from '../../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetOp,
  buildSetStateRuleOp,
  buildSetTransactionBody,
  buildSetValueOp,
  buildSetWriteRuleOp,
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

    await ainizeLogin(this.ain, this.ainize); // TODO(jiyoung): replace with signer.

    const currentBalance = await aiService.getCreditBalance();
    const txHash = await aiService.chargeCredit(amount);
    const updatedBalance = await this.waitForCreditUpdate(
      currentBalance + amount,
      60 * 1000,
      aiService
    );

    await ainizeLogout(this.ainize);

    return { tx_hash: txHash, address, balance: updatedBalance };
  }

  // TODO(jiyoung): define interface for input parameters.
  async getCredit(provider: string, api: string): Promise<number> {
    const aiName = validateAndGetAiName(provider, api);
    const aiService = await validateAndGetAiService(aiName, this.ainize);

    await ainizeLogin(this.ain, this.ainize); // TODO(jiyoung): replace with signer.

    const balance = await aiService.getCreditBalance();

    await ainizeLogout(this.ainize);

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
    const value = { name: aiName, type: 'chat', url: `https://${aiName}.ainetwork.xyz` };
    const rule = {
      write: 'auth.addr === $user_addr',
      state: { gc_max_siblings: 20, gc_num_siblings_deleted: 10 },
    };

    const path = `/apps/${appId}/tokens/$token_id/ai/$ai_name/history/$user_addr`;
    const suffix = `threads/$thread_id/messages/$message_id`;

    const setValueOp = buildSetValueOp(ref, value);
    const setWriteRuleOp = buildSetWriteRuleOp(path, rule.write);
    const setGCRuleOp = buildSetStateRuleOp(`${path}/${suffix}`, rule.state);
    const setOp = buildSetOp([setValueOp, setWriteRuleOp, setGCRuleOp]);

    return buildSetTransactionBody(setOp, address);
  }
}
