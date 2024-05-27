import _ from 'lodash';
import Service from '@ainize-team/ainize-js/dist/service';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getService, request } from '../ainize';
import {
  AiConfigurationTransactionResult,
  CreditTransactionResult,
  NftToken,
  NftTokens,
  QueryParams,
  TokenStatus,
} from '../types';
import { buildSetTxBody, buildSetValueOp, sleep, sendTx } from '../utils/util';
import { Path } from '../utils/path';
import { validateObject, validateObjectOwner } from '../utils/validator';
import { DEFAULT_AINIZE_SERVICE_NAME } from '../constants';

/**
 * This class manages ai configurations for AINFT object,\
 * manages the credits needed for their uses, and checks if tokens are available for creation.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Ai extends FactoryBase {
  /**
   * Sets up ai configuration for an AINFT object.
   * @param {string} objectId - The ID of the AINFT object.
   * @param {string} serviceName - The name of Ainize service.
   * @returns {Promise<AiConfigurationTransactionResult>} Returns a promise that resolves with both the transaction result and the configuration info.
   */
  async configure(
    objectId: string,
    serviceName: string
  ): Promise<AiConfigurationTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateObjectOwner(this.ain, objectId, address);
    await getService(this.ainize!, serviceName); // NOTE(jiyoung): check if the service is deployed on Ainize.

    const txBody = this.buildTxBodyForConfigureAi(objectId, serviceName, address);
    const result = await sendTx(this.ain, txBody);

    return { ...result, config: { name: serviceName } };
  }

  /**
   * Retrieves the credit balance for a service.
   * @param {string} serviceName - The name of Ainize service.
   * @returns {Promise<number|null>} Returns a promise that resolves with the credit balance.
   */
  async getCredit(serviceName: string): Promise<number> {
    const address = await this.ain.signer.getAddress();

    let balance = 0;

    if (serviceName === DEFAULT_AINIZE_SERVICE_NAME) {
      const opType = OperationType.GET_CREDIT;
      const body = { address };

      const response = await request<number>(this.ainize!, {
        serviceName: serviceName,
        opType,
        data: body,
        timeout: 2*60*1000, // 2min
      });
      balance = response.data;
    } else {
      const service = await getService(this.ainize!, serviceName);
      balance = await service.getCreditBalance();
    }

    return balance;
  }

  /**
   * @todo Enable deposit function once withdrawal is fully implemented and tested.
   * Deposits a credits for a service.
   * @param {string} serviceName - The name of Ainize service.
   * @param {number} amount - The amount of credits to deposit.
   * @returns {Promise<CreditTransactionResult>} Returns a promise that resolves with the deposit transaction info.
   */
  /*
  async depositCredit(serviceName: string, amount: number): Promise<CreditTransactionResult> {
    const address = await this.ain.signer.getAddress();

    const service = await getService(this.ainize!, serviceName); // NOTE(jiyoung): check if the service is deployed on Ainize.

    const currentBalance = await service.getCreditBalance();
    const txHash = await service.chargeCredit(amount);
    const updatedBalance = await this.waitForUpdate(
      service,
      currentBalance + amount,
      60*1000, // 1min
      txHash
    );

    return { tx_hash: txHash, address, balance: updatedBalance };
  }
  */

  // TODO(jiyoung): refactor this method.
  async getUserTokensByStatus(
    objectId: string,
    address: string,
    status?: TokenStatus,
    { limit = 20, offset = 0, order = 'desc' }: QueryParams = {}
  ) {
    await validateObject(this.ain, objectId);

    const appId = AinftObject.getAppId(objectId);
    const tokensPath = Path.app(appId).tokens().value();
    const allTokens: NftTokens = (await this.ain.db.ref(tokensPath).getValue()) || {};

    const tokens = Object.entries(allTokens).reduce<NftToken[]>((acc, [id, token]) => {
      if (token.owner === address) {
        acc.push({ tokenId: id, ...token });
      }
      return acc;
    }, []);

    tokens.map((token) => {
      let status = 'minted';
      const assistantCreated = token.ai;
      if (assistantCreated) {
        status = 'assistant_created';
        const threadCreated = _.some(token.ai.history, (address) => !_.isEmpty(address.threads));
        if (threadCreated) {
          status = 'thread_created';
          const messageCreated = _.some(token.ai.history, (address) =>
            _.some(
              address.threads,
              (thread) => _.isObject(thread.messages) && !_.isEmpty(thread.messages)
            )
          );
          if (messageCreated) {
            status = 'message_created';
          }
        }
      }
      token.status = status;
      return token;
    });

    const filtered = tokens.filter((token) => !status || token.status === status);
    const sorted = _.orderBy(filtered, ['tokenId'], [order]);

    const total = sorted.length;
    const items = sorted.slice(offset, offset + limit);

    return { total, items };
  }

  private buildTxBodyForConfigureAi(objectId: string, serviceName: string, address: string) {
    const appId = AinftObject.getAppId(objectId);
    const path = Path.app(appId).ai(serviceName).value();
    return buildSetTxBody(buildSetValueOp(path, { name: serviceName }), address);
  }

  private async waitForUpdate(service: Service, expected: number, timeout: number, txHash: string) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const balance = await service.getCreditBalance();
      if (balance === expected) {
        return balance;
      }
      await sleep(1000); // 1sec
    }
    throw new Error(`timeout of ${timeout}ms exceeded.\nplease check the transaction status: ${txHash}`);
  }
}
