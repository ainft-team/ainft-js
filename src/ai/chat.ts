import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../ainft721Object';
import BlockchainBase from '../blockchainBase';
import { Assistants } from './assistant';
import { Threads } from './thread';
import { Messages } from './message';
import {
  ServiceType,
  ServiceNickname,
  CreditTransactionResult,
  ChatConfigurationTransactionResult,
  ChatConfiguration,
} from '../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetTransactionBody,
  buildSetValueOp,
  isTransactionSuccess,
  Ref,
  sleep,
  validateAndGetServiceName,
  validateAndGetService,
  validateObject,
  validateObjectOwner,
  validateService,
  sendTransaction,
} from '../utils/util';

/**
 * This class supports configuring chat functionality for an AINFT object,\
 * and managing the required credits for its use.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Chat extends BlockchainBase {
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
   * @param {ServiceNickname} nickname - The service nickname.
   * @returns {Promise<ChatConfigurationTransactionResult>} Returns a promise that resolves with both the transaction result and the chat configuration.
   */
  async configure(
    objectId: string,
    nickname: ServiceNickname
  ): Promise<ChatConfigurationTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateService(serviceName, this.ainize);

    const config = {
      type: ServiceType.CHAT,
      name: serviceName,
    };

    const txBody = this.buildTxBodyForConfigureChat(config, appId, serviceName, address);
    const result = await sendTransaction(txBody, this.ain);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, config };
  }

  /**
   * Deposits a credits for a service.
   * @param {ServiceNickname} nickname - The service nickname for which credits are deposited.
   * @param {number} amount - The amount of credits to deposit.
   * @returns {Promise<CreditTransactionResult>} Returns a promise that resolves with the deposit transaction details (hash, address, and updated credit balance).
   */
  async depositCredit(nickname: ServiceNickname, amount: number): Promise<CreditTransactionResult> {
    const address = this.ain.signer.getAddress();

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const currentCredit = await service.getCreditBalance();
    const txHash = await service.chargeCredit(amount);
    const updatedCredit = await this.waitForUpdate(currentCredit + amount, 60000, txHash, service); // 1min

    await ainizeLogout(this.ainize);

    return { tx_hash: txHash, address, balance: updatedCredit };
  }

  /**
   * Get the current credit for a service.
   * @param {ServiceNickname} nickname - The service to check the credit.
   * @returns {Promise<number|null>} Returns a promise that resolves with the current credit balance.
   */
  async getCredit(nickname: ServiceNickname): Promise<number> {
    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
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
    throw new Error(`Credit update timed out. Please check the transaction on insight: ${txHash}`);
  }

  private buildTxBodyForConfigureChat(
    config: ChatConfiguration,
    appId: string,
    serviceName: string,
    address: string
  ) {
    const ref = Ref.app(appId).ai(serviceName);

    return buildSetTransactionBody(buildSetValueOp(ref, config), address);
  }
}
