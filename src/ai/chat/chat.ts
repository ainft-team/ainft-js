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
  validateService,
} from '../../util';

/**
 * This class supports configuring chat functionality for an AINFT object,\
 * and managing the required credits for its use.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class Chat extends BlockchainBase {
  assistant: Assistants;
  thread: Threads;
  message: Messages;

  constructor(ain: Ain, ainize: Ainize) {
    super(ain, ainize);
    this.assistant = new Assistants(ain, ainize);
    this.thread = new Threads(ain, ainize);
    this.message = new Messages(ain, ainize);
  }

  /**
   * Configures chat for an AINFT object.
   * @param {string} objectId - The ID of the AINFT object to configure for chat.
   * @param {ServiceProvider} provider - The service provider.
   * @returns {Promise<TransactionResult>} Returns a promise that resolves with the chat configuration transaction result.
   */
  async configure(objectId: string, provider: ServiceProvider): Promise<TransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateService(serviceName, this.ainize);

    const txBody = this.buildTxBodyForConfigureChat(appId, serviceName, address);
    const result = await this.ain.sendTransaction(txBody);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return result;
  }

  /**
   * Deposits a credits for a service provider.
   * @param {ServiceProvider} provider - The service provider for which credits are deposited.
   * @param {number} amount - The amount of credits to deposit.
   * @returns {Promise<CreditTransactionResult>} Returns a promise that resolves with the deposit transaction details (hash, address, and updated credit balance).
   */
  async depositCredit(provider: ServiceProvider, amount: number): Promise<CreditTransactionResult> {
    const address = this.ain.signer.getAddress();

    const serviceName = validateAndGetServiceName(provider);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const currentCredit = await service.getCreditBalance();
    const txHash = await service.chargeCredit(amount);
    const updatedCredit = await this.waitForUpdate(currentCredit + amount, 60000, txHash, service); // 1min

    await ainizeLogout(this.ainize);

    return { tx_hash: txHash, address, balance: updatedCredit };
  }

  /**
   * Get the current credit for a service provider.
   * @param {ServiceProvider} provider - The service provider to check the credit.
   * @returns {Promise<number>} Returns a promise that resolves with the current credit balance.
   */
  async getCredit(provider: ServiceProvider): Promise<number> {    
    const serviceName = validateAndGetServiceName(provider);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const credit = await service.getCreditBalance();

    await ainizeLogout(this.ainize);

    return credit;
  }

  private async waitForUpdate(expected: number, timeout: number, txHash: string, service: Service) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const credit = await service.getCreditBalance();
      if (credit === expected) {
        return expected;
      }
      await sleep(1000); // 1sec
    }
    throw new Error(`Credit update timed out. Please check the transaction on Insight using this hash: ${txHash}`);
  }

  private buildTxBodyForConfigureChat(appId: string, serviceName: string, address: string) {
    const ref = Ref.app(appId).ai(serviceName);
    const path = `/apps/${appId}/tokens/$token_id/ai/$ai_name/history/$user_addr`;
    const subpath = 'threads/$thread_id/messages/$message_id';

    const value = {
      name: serviceName,
      type: AiType.CHAT,
      // TODO(jiyoung): fetch information from ainize.
      url: `https://${serviceName}.ainetwork.xyz`,
    };
    const rule = {
      // TODO(jiyoung): fix minting issue after setting write rule.
      // write: 'auth.addr === $user_addr',
      // TODO(jiyoung): discuss whether to apply gc rule for messages.
      // state: { gc_max_siblings: 20, gc_num_siblings_deleted: 10 },
    };

    const setValueOp = buildSetValueOp(ref, value);
    // const setWriteRuleOp = buildSetWriteRuleOp(path, rule.write);
    // const setGCRuleOp = buildSetStateRuleOp(`${path}/${subpath}`, rule.state);
    const setOp = buildSetOp([setValueOp, /*setWriteRuleOp, setGCRuleOp*/]);

    return buildSetTransactionBody(setOp, address);
  }
}
