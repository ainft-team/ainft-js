import _ from 'lodash';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getServiceName, request } from '../ainize';
import {
  QueryParams,
  Thread,
  ThreadCreateAndRunParams,
  ThreadCreateParams,
  ThreadDeleteTransactionResult,
  ThreadDeleted,
  ThreadTransactionResult,
  ThreadUpdateParams,
  ThreadWithAssistant,
  ThreadWithMessages,
} from '../types';
import {
  buildSetTxBody,
  buildSetValueOp,
  getAssistant,
  getChecksumAddress,
  getValue,
  sendTx,
} from '../utils/util';
import { Path } from '../utils/path';
import {
  validateAssistant,
  validateObject,
  validateServerConfigurationForObject,
  validateThread,
  validateToken,
} from '../utils/validator';

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
   * @returns Returns a promise that resolves with both the transaction result and the created thread.
   */
  async create(
    objectId: string,
    tokenId: string,
    { metadata }: ThreadCreateParams
  ): Promise<ThreadTransactionResult> {
    const appId = AinftObject.getAppId(objectId);
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    const assistant = await getAssistant(this.ain, appId, tokenId);

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.CREATE_THREAD;
    const body = {
      objectId,
      tokenId,
      assistant: {
        id: assistant?.id,
        model: assistant?.config?.model,
        name: assistant?.config?.name,
        instructions: assistant?.config?.instructions,
        description: assistant?.config?.description || null,
        metadata: assistant?.config?.metadata || null,
        createdAt: assistant?.createdAt,
      },
      address,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await request<Thread>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const txBody = this.buildTxBodyForCreateThread(address, objectId, tokenId, data);
    const result = await sendTx(this.ain, txBody);

    return { ...result, thread: data };
  }

  /**
   * Updates a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {ThreadUpdateParams} ThreadUpdateParams - The parameters to update thread.
   * @returns Returns a promise that resolves with both the transaction result and the updated thread.
   */
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
    const result = await sendTx(this.ain, txBody);

    return { ...result, thread: data };
  }

  /**
   * Deletes a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @returns Returns a promise that resolves with both the transaction result and the deleted thread.
   */
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
    const result = await sendTx(this.ain, txBody);

    return { ...result, delThread: data };
  }

  /**
   * Retrieves a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {string} address - The checksum address of account.
   * @returns Returns a promise that resolves with the thread.
   */
  async get(objectId: string, tokenId: string, threadId: string, address: string): Promise<Thread> {
    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const appId = AinftObject.getAppId(objectId);
    const threadPath = Path.app(appId).token(tokenId).ai().history(address).thread(threadId).value();
    const data = await this.ain.db.ref(threadPath).getValue();
    const thread = {
      id: data.id,
      metadata: data.metadata || {},
      created_at: data.createdAt,
    };

    return thread;
  }

  /**
   * Retrieves a list of threads.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string | null} [tokenId] - The ID of AINFT token.
   * @param {string | null} [address] - The checksum address of account.
   * @param {QueryParams} QueryParams - The parameters for querying items.
   * @returns Returns a promise that resolves with the list of threads.
   */
  async list(
    objectId: string,
    tokenId?: string | null,
    address?: string | null,
    { limit = 20, offset = 0, order = 'desc' }: QueryParams = {}
  ) {
    await validateObject(this.ain, objectId);
    if (tokenId) {
      await validateToken(this.ain, objectId, tokenId);
    }

    const tokens = await this.fetchTokens(objectId);
    const threads = this.flattenThreads(tokens);
    const filtered = this.filterThreads(threads, tokenId, address);
    const sorted = _.orderBy(filtered, ['created_at'], [order]);

    const total = sorted.length;
    const items = sorted.slice(offset, offset + limit);

    return { total, items };
  }

  async createAndRun(
    objectId: string,
    tokenId: string,
    { metadata, messages }: ThreadCreateAndRunParams
  ) {
    const appId = AinftObject.getAppId(objectId);
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const assistant = await getAssistant(this.ain, appId, tokenId);
    const opType = OperationType.CREATE_RUN_THREAD;
    const body = {
      assistantId: assistant.id,
      ...(metadata && !_.isEmpty(metadata) && { metadata }), // thread
      ...(messages && messages.length > 0 && { messages }),
    };

    const { data } = await request<ThreadWithMessages>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const txBody = this.buildTxBodyForCreateAndRunThread(address, objectId, tokenId, data);
    const result = await sendTx(this.ain, txBody);

    return { ...result, ...data };
    // NOTE(jiyoung): example data
    /*
    return {
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
      thread: {
        id: 'thread_yjw3LcSxSxIkrk225v7kLpCA',
        created_at: 1711962854,
        metadata: {
          title: '도와드릴까요?',
        },
      },
      messages: {
        '0': {
          id: 'msg_Fay6rXAtGqBADFhukBzeZtjN',
          created_at: 1711967047,
          thread_id: 'thread_yjw3LcSxSxIkrk225v7kLpCA',
          role: 'user',
          content: {
            '0': {
              type: 'text',
              text: {
                value: '안녕하세요',
              },
            },
          },
          assistant_id: null,
          run_id: null,
        },
        '1': {
          id: 'msg_17BndvyTHP5i99QM1Ha4okaV',
          created_at: 1711967100,
          thread_id: 'thread_yjw3LcSxSxIkrk225v7kLpCA',
          role: 'assistant',
          content: {
            '0': {
              type: 'text',
              text: {
                value: '안녕하세요! 무엇을 도와드릴까요?',
              },
            },
          },
          assistant_id: 'asst_IfWuJqqO5PdCF9DbgZRcFClG',
          run_id: 'run_l0eBpAdMOtj8uAwrkAMKWg4l',
        },
      },
    };
    */
  }

  private buildTxBodyForCreateThread(
    address: string,
    objectId: string,
    tokenId: string,
    { id, metadata, created_at }: Thread
  ) {
    const appId = AinftObject.getAppId(objectId);
    const threadPath = Path.app(appId).token(tokenId).ai().history(address).thread(id).value();
    const value = {
      id,
      createdAt: created_at,
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

  private buildTxBodyForCreateAndRunThread(
    address: string,
    objectId: string,
    tokenId: string,
    { thread, messages }: ThreadWithMessages
  ) {
    const appId = AinftObject.getAppId(objectId);
    const threadPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(thread.id)
      .value();

    // FIXME(jiyoung): prevent message overwrite from same timestamp.
    const newMessages: { [key: string]: object } = {};
    Object.keys(messages).forEach((key) => {
      const { id, created_at, role, content, metadata } = messages[key];
      newMessages[`${created_at}`] = {
        id,
        role,
        createdAt: created_at,
        ...(content && !_.isEmpty(content) && { content }),
        ...(metadata && !_.isEmpty(metadata) && { metadata }),
      };
    });

    const value = {
      id: thread.id,
      createdAt: thread.created_at,
      ...(!_.isEmpty(newMessages) ? { messages: newMessages } : { messages: true }),
      ...(thread.metadata && !_.isEmpty(thread.metadata) && { metadata: thread.metadata }),
    };

    return buildSetTxBody(buildSetValueOp(threadPath, value), address);
  }

  private async fetchTokens(objectId: string) {
    const appId = AinftObject.getAppId(objectId);
    const tokensPath = Path.app(appId).tokens().value();
    return this.ain.db.ref(tokensPath).getValue();
  }

  private flattenThreads(tokens: any) {
    const flatten: any = [];
    _.forEach(tokens, (token, tokenId) => {
      const assistant = token.ai;
      if (!assistant) {
        return;
      }
      const histories = assistant.history;
      if (typeof histories !== 'object' || histories === true) {
        return;
      }
      _.forEach(histories, (history, address) => {
        const threads = _.get(history, 'threads');
        _.forEach(threads, (thread) => {
          flatten.push({
            id: thread.id,
            metadata: thread.metadata || {},
            created_at: thread.createdAt,
            assistant: {
              id: assistant.id,
              tokenId,
              model: assistant.config.model,
              name: assistant.config.name,
              instructions: assistant.config.instructions,
              description: assistant.config.description || null,
              metadata: assistant.config.metadata || {},
              created_at: assistant.createdAt,
            },
            author: { address },
          });
        });
      });
    });
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
}
