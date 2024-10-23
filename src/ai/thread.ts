import _ from 'lodash';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getServiceName, request } from '../utils/ainize';
import {
  QueryParams,
  Thread,
  ThreadCreateParams,
  ThreadDeleteTransactionResult,
  ThreadDeleted,
  ThreadTransactionResult,
  ThreadUpdateParams,
  ThreadWithMessages,
} from '../types';
import { Path } from '../utils/path';
import { buildSetValueOp, buildSetTxBody, sendTx } from '../utils/transaction';
import { getAssistant, getValue, isMillisecond, toSecond } from '../utils/util';
import {
  validateAssistant,
  validateObject,
  validateServerConfigurationForObject,
  validateThread,
  validateToken,
} from '../utils/validator';
import { authenticated } from '../utils/decorator';
import { AinftError } from '../error';

/**
 * This class supports create threads that assistant can interact with.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Threads extends FactoryBase {
  /**
   * Create a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ThreadCreateParams} ThreadCreateParams - The parameters to create thread.
   * @returns A promise that resolves with both the transaction result and the created thread.
   */
  @authenticated
  async create(
    objectId: string,
    tokenId: string,
    { metadata }: ThreadCreateParams
  ): Promise<ThreadTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    const _assistant = await validateAssistant(this.ain, objectId, tokenId);

    const assistant = await getAssistant(this.ain, objectId, tokenId, _assistant.id);
    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.CREATE_THREAD;
    const body = {
      objectId,
      tokenId,
      assistantId: assistant.id,
      address,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await request<Thread>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const thread = {
      id: data.id,
      metadata: data.metadata,
      createdAt: data.createdAt,
      updatedAt: data.createdAt,
      assistant: {
        id: assistant.id,
        createdAt: assistant.createdAt,
        model: assistant.model,
        name: assistant.name,
        description: assistant.description || null,
        instructions: assistant.instructions || null,
        metadata: {
          author: assistant.metadata?.author || null,
          bio: assistant.metadata?.bio || null,
          chatStarter: assistant.metadata?.chatStarter
            ? Object.values(assistant.metadata?.chatStarter)
            : null,
          greetingMessage: assistant.metadata?.greetingMessage || null,
          image: assistant.metadata?.image || null,
          tags: assistant.metadata?.tags ? Object.values(assistant.metadata?.tags) : null,
        },
        metrics: assistant.metrics || {},
      },
    };

    const txBody = this.buildTxBodyForCreateThread(address, objectId, tokenId, data);
    const result = await sendTx(txBody, this.ain);

    return { ...result, thread, tokenId };
  }

  /**
   * Updates a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {ThreadUpdateParams} ThreadUpdateParams - The parameters to update thread.
   * @returns A promise that resolves with both the transaction result and the updated thread.
   */
  @authenticated
  async update(
    objectId: string,
    tokenId: string,
    threadId: string,
    { metadata }: ThreadUpdateParams
  ): Promise<ThreadTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.MODIFY_THREAD;
    const body = {
      threadId,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await request<Thread>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const txBody = await this.buildTxBodyForUpdateThread(address, objectId, tokenId, data);
    const result = await sendTx(txBody, this.ain);

    return { ...result, thread: data };
  }

  /**
   * Deletes a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @returns A promise that resolves with both the transaction result and the deleted thread.
   */
  @authenticated
  async delete(
    objectId: string,
    tokenId: string,
    threadId: string
  ): Promise<ThreadDeleteTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.DELETE_THREAD;
    const body = { threadId };

    const { data } = await request<ThreadDeleted>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const txBody = this.buildTxBodyForDeleteThread(address, objectId, tokenId, threadId);
    const result = await sendTx(txBody, this.ain);

    return { ...result, delThread: data };
  }

  /**
   * Retrieves a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {string} address - The checksum address of account.
   * @returns A promise that resolves with the thread.
   */
  async get(objectId: string, tokenId: string, threadId: string, address: string): Promise<Thread> {
    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const appId = AinftObject.getAppId(objectId);
    const threadPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .value();
    const thread = await this.ain.db.ref(threadPath).getValue();

    return {
      id: thread.id,
      createdAt: isMillisecond(thread.createdAt) ? toSecond(thread.createdAt) : thread.createdAt,
      metadata: thread.metadata || {},
    };
  }

  /**
   * Retrieves a list of threads.
   * @param {string[]} objectIds - The ID(s) of AINFT object.
   * @param {string | null} [tokenId] - The ID of AINFT token.
   * @param {string | null} [address] - The checksum address of account.
   * @param {QueryParams} QueryParams - The parameters for querying items.
   * @returns A promise that resolves with the list of threads.
   */
  async list(
    objectIds: string[],
    tokenId?: string | null,
    address?: string | null,
    { limit = 20, offset = 0, sort = 'created', order = 'desc' }: QueryParams = {}
  ) {
    await Promise.all(objectIds.map((objectId) => validateObject(this.ain, objectId)));

    if (tokenId) {
      await Promise.all(objectIds.map((objectId) => validateToken(this.ain, objectId, tokenId)));
    }

    const allThreads = await Promise.all(
      objectIds.map(async (objectId) => {
        const tokens = await this.fetchTokens(objectId);
        return await this.flattenThreads(objectId, tokens);
      })
    );
    const threads = allThreads.flat();

    const filtered = this.filterThreads(threads, tokenId, address);
    const sorted = this.sortThreads(filtered, sort, order);

    const total = sorted.length;
    const items = sorted.slice(offset, offset + limit);

    return { total, items };
  }

  private buildTxBodyForCreateThread(
    address: string,
    objectId: string,
    tokenId: string,
    { id, metadata, createdAt }: Thread
  ) {
    const appId = AinftObject.getAppId(objectId);
    const threadPath = Path.app(appId).token(tokenId).ai().history(address).thread(id).value();
    const value = {
      id,
      createdAt,
      messages: true,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };
    return buildSetTxBody(buildSetValueOp(threadPath, value), address);
  }

  private async buildTxBodyForUpdateThread(
    address: string,
    objectId: string,
    tokenId: string,
    { id, metadata }: Thread
  ) {
    const appId = AinftObject.getAppId(objectId);
    const threadPath = Path.app(appId).token(tokenId).ai().history(address).thread(id).value();
    const prev = await getValue(this.ain, threadPath);
    const value = {
      ...prev,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };
    return buildSetTxBody(buildSetValueOp(threadPath, value), address);
  }

  private buildTxBodyForDeleteThread(
    address: string,
    objectId: string,
    tokenId: string,
    threadId: string
  ) {
    const appId = AinftObject.getAppId(objectId);
    const threadPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .value();
    return buildSetTxBody(buildSetValueOp(threadPath, null), address);
  }

  private async fetchTokens(objectId: string) {
    const appId = AinftObject.getAppId(objectId);
    const tokensPath = Path.app(appId).tokens().value();
    return this.ain.db.ref(tokensPath).getValue();
  }

  private async flattenThreads(objectId: string, tokens: any) {
    const flatten: any = [];
    await Promise.all(
      _.map(tokens, async (token, tokenId) => {
        if (!token.ai) {
          return;
        }
        const assistantId = token.ai.id;
        const assistant = await getAssistant(this.ain, objectId, tokenId, assistantId);
        const histories = token.ai.history;
        if (typeof histories !== 'object' || histories === true) {
          return;
        }
        _.forEach(histories, (history, address) => {
          const threads = _.get(history, 'threads');
          _.forEach(threads, (thread) => {
            const createdAt = isMillisecond(thread.createdAt)
              ? toSecond(thread.createdAt)
              : thread.createdAt;
            let updatedAt = createdAt;
            if (typeof thread.messages === 'object' && thread.messages !== null) {
              const keys = Object.keys(thread.messages);
              updatedAt = Number(keys[keys.length - 1]);
            }
            flatten.push({
              id: thread.id,
              metadata: thread.metadata || {},
              createdAt: createdAt,
              updatedAt,
              assistant: {
                id: assistant.id,
                createdAt: assistant.createdAt,
                objectId,
                tokenId,
                tokenOwner: token.owner,
                model: assistant.model,
                name: assistant.name,
                description: assistant.description || null,
                instructions: assistant.instructions || null,
                metadata: assistant.metadata || {},
                metrics: assistant.metrics || {},
              },
              author: { address },
            });
          });
        });
      })
    );
    return flatten;
  }

  private filterThreads(threads: any, tokenId?: string | null, address?: string | null) {
    return _.filter(threads, (thread) => {
      const threadTokenId = _.get(thread, 'assistant.tokenId');
      const threadAddress = _.get(thread, 'author.address');
      const tokenIdMatch = tokenId ? threadTokenId === tokenId : true;
      const addressMatch = address ? threadAddress === address : true;
      return tokenIdMatch && addressMatch;
    });
  }

  private sortThreads(threads: any, sort: string, order: 'asc' | 'desc') {
    if (sort === 'created') {
      return _.orderBy(threads, ['createdAt'], [order]);
    } else if (sort === 'updated') {
      return _.orderBy(threads, ['updatedAt'], [order]);
    } else {
      throw new AinftError('bad-request', `invalid sort criteria: ${sort}`);
    }
  }
}
