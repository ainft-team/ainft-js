import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../../ainft721Object';
import BlockchainBase from '../../blockchainBase';
import Assistants from './assistants';
import Threads from './threads';
import Messages from './messages';
import { AiType, ServiceProvider, CreditTransactionResult, TransactionResult } from '../../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetOp,
  buildSetTransactionBody,
  buildSetValueOp,
  buildSetWriteRuleOp,
  isTransactionSuccess,
  Ref,
  sleep,
  validateAndGetServiceName,
  validateAndGetService,
  validateObject,
  validateObjectOwner,
} from '../../util';

export default class Chat extends BlockchainBase {
  assistants: Assistants;
  threads: Threads;
  messages: Messages;

  constructor(ain: Ain, ainize: Ainize) {
    super(ain, ainize);
    this.assistants = new Assistants(ain, ainize);
    this.threads = new Threads(ain, ainize);
    this.messages = new Messages(ain, ainize);
  }

  async configure(objectId: string, provider: ServiceProvider): Promise<TransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateAndGetService(serviceName, this.ainize);

    const txBody = this.buildTxBodyForConfigureChat(appId, serviceName, address);
    const result = await this.ain.sendTransaction(txBody);

    if (!isTransactionSuccess(result)) {
      throw Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return result;
  }

  async depositCredit(provider: ServiceProvider, amount: number): Promise<CreditTransactionResult> {
    const address = this.ain.signer.getAddress();

    const serviceName = validateAndGetServiceName(provider);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const currentCredit = await service.getCreditBalance();
    const txHash = await service.chargeCredit(amount);
    const updatedCredit = await this.waitForUpdate(currentCredit + amount, 60 * 1000, service); // 1min

    await ainizeLogout(this.ainize);

    return { tx_hash: txHash, address, balance: updatedCredit };
  }

  async getCredit(provider: ServiceProvider): Promise<number> {
    const serviceName = validateAndGetServiceName(provider);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const credit = await service.getCreditBalance();

    await ainizeLogout(this.ainize);

    return credit;
  }

  private async waitForUpdate(expected: number, timeout: number, service: Service) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const credit = await service.getCreditBalance();
      if (credit === expected) {
        return expected;
      }
      await sleep(1 * 1000); // 1sec
    }
    throw new Error('Credit update failed due to timeout');
  }

  private buildTxBodyForConfigureChat(appId: string, serviceName: string, address: string) {
    const ref = Ref.app(appId).ai(serviceName);
    const path = `/apps/${appId}/tokens/$token_id/ai/$ai_name/history/$user_addr`;
    const subpath = 'threads/$thread_id/messages/$message_id';

    const value = {
      name: serviceName,
      type: AiType.CHAT,
      url: `https://${serviceName}.ainetwork.xyz`,
    };
    const rule = {
      write: 'auth.addr === $user_addr',
      // TODO(jiyoung): discuss whether to apply gc rule for messages.
      // state: { gc_max_siblings: 20, gc_num_siblings_deleted: 10 },
    };

    const setValueOp = buildSetValueOp(ref, value);
    const setWriteRuleOp = buildSetWriteRuleOp(path, rule.write);
    // const setGCRuleOp = buildSetStateRuleOp(`${path}/${subpath}`, rule.state);
    const setOp = buildSetOp([setValueOp, setWriteRuleOp /*, setGCRuleOp*/]);

    return buildSetTransactionBody(setOp, address);
  }
}
