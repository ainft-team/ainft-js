import Service from '@ainize-team/ainize-js/dist/service';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { getServer, login, logout } from '../ainize';
import {
  ServiceType,
  CreditTransactionResult,
  ChatConfigurationTransactionResult,
  ChatConfiguration,
  ServiceNickname,
} from '../types';
import { buildSetTxBody, buildSetValueOp, sleep, sendTx } from '../utils/util';
import { Path } from '../utils/path';
import { validateObject, validateObjectOwner } from '../utils/validator';

/**
 * This class supports configuring chat functionality for an AINFT object,\
 * and managing the required credits for its use.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Chat extends FactoryBase {
  /**
   * Configures chat for an AINFT object.
   * @param {string} objectId - The ID of the AINFT object to configure for chat.
   * @param {string} nickname - The nickname of Ainize service.
   * @returns {Promise<ChatConfigurationTransactionResult>} Returns a promise that resolves with both the transaction result and the chat configuration.
   */
  async configure(objectId: string, nickname: string): Promise<ChatConfigurationTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateObjectOwner(this.ain, objectId, address);

    await getServer(this.ainize!, nickname);

    const config = {
      type: ServiceType.CHAT,
      name: nickname,
    };

    const txBody = this.buildTxBodyForConfigureChat(config, objectId, nickname, address);
    const result = await sendTx(this.ain, txBody);

    return { ...result, config };
  }

  /**
   * Deposits a credits for a service.
   * Please note that deposit is disabled until withdrawal is ready.
   * @param {ServiceNickname} nickname - The service nickname for which credits are deposited.
   * @param {number} amount - The amount of credits to deposit.
   * @returns {Promise<CreditTransactionResult>} Returns a promise that resolves with the deposit transaction details (hash, address, and updated credit balance).
   */
  /*
  async depositCredit(nickname: ServiceNickname, amount: number): Promise<CreditTransactionResult> {
    const address = await this.ain.signer.getAddress();

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const currentCredit = await service.getCreditBalance();
    const txHash = await service.chargeCredit(amount);
    const updatedCredit = await this.waitForUpdate(currentCredit + amount, 60000, txHash, service); // 1min

    await ainizeLogout(this.ainize);

    return { tx_hash: txHash, address, balance: updatedCredit };
  }
  */

  /**
   * Get the current credit for a service.
   * @param {string} nickname - The nickname of Ainize service.
   * @returns {Promise<number|null>} Returns a promise that resolves with the current credit balance.
   */
  async getCredit(nickname: string): Promise<number> {
    const server = await getServer(this.ainize!, nickname);
    await login(this.ainize!, this.ain);
    const credit = await server.getCreditBalance();
    await logout(this.ainize!);
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
    objectId: string,
    serviceName: string,
    address: string
  ) {
    const appId = AinftObject.getAppId(objectId);
    const ref = Path.app(appId).ai(serviceName).value();
    return buildSetTxBody(buildSetValueOp(ref, config), address);
  }
}
