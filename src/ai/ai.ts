import _ from 'lodash';
import Service from '@ainize-team/ainize-js/dist/service';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getService, request } from '../utils/ainize';
import {
  AiConfigurationTransactionResult,
  CreditTransactionResult,
  NftToken,
  NftTokens,
  QueryParamsWithoutSort,
  TokenStatus,
} from '../types';
import { DEFAULT_AINIZE_SERVICE_NAME } from '../constants';
import { Path } from '../utils/path';
import { buildSetTxBody, buildSetValueOp, sendTx } from '../utils/transaction';
import { sleep } from '../utils/util';
import { validateObject, validateObjectOwner } from '../utils/validator';
import { authenticated } from '../utils/decorator';
import { AinftError } from '../error';

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
   * @returns {Promise<AiConfigurationTransactionResult>} A promise that resolves with both the transaction result and the configuration info.
   */
  @authenticated
  async configure(
    objectId: string,
    serviceName: string
  ): Promise<AiConfigurationTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateObjectOwner(this.ain, objectId, address);
    await getService(this.ainize!, serviceName); // NOTE(jiyoung): check if the service is deployed on Ainize.

    const txBody = this.buildTxBodyForConfigureAi(objectId, serviceName, address);
    const result = await sendTx(txBody, this.ain);

    return { ...result, config: { name: serviceName } };
  }

  /**
   * Retrieves the credit balance for a service.
   * @param {string} serviceName - The name of Ainize service.
   * @returns {Promise<number|null>} A promise that resolves with the credit balance.
   */
  @authenticated
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
        timeout: 2 * 60 * 1000, // 2min
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
   * @returns {Promise<CreditTransactionResult>} A promise that resolves with the deposit transaction info.
   */
  /*
  @authenticated
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
    status?: string | null,
    { limit = 20, offset = 0, order = 'desc' }: QueryParamsWithoutSort = {}
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
      let status = TokenStatus.MINTED;
      const assistantCreated = token.ai;
      if (assistantCreated) {
        status = TokenStatus.ASSISTANT_CREATED;
        const threadCreated = _.some(token.ai.history, (address) => !_.isEmpty(address.threads));
        if (threadCreated) {
          status = TokenStatus.THREAD_CREATED;
          const messageCreated = _.some(token.ai.history, (address) =>
            _.some(
              address.threads,
              (thread) => _.isObject(thread.messages) && !_.isEmpty(thread.messages)
            )
          );
          if (messageCreated) {
            status = TokenStatus.MESSAGE_CREATED;
          }
        }
      }
      token.status = status;
      return token;
    });

    const filtered = tokens.filter((token) => !status || token.status == status);
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
    throw new AinftError(
      'gateway-timeout',
      `timeout of ${timeout}ms exceeded. please check the transaction status: ${txHash}`
    );
  }
}
