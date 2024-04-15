import _ from 'lodash';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { AinizeService, OperationType } from '../ainize';
import {
  Message,
  MessageCreateParams,
  MessagesTransactionResult,
  MessageMap,
  MessageTransactionResult,
  MessageUpdateParams,
  Page,
} from '../types';
import { buildSetTxBody, buildSetValueOp, getValue, sendTx } from '../utils/util';
import {
  validateAssistant,
  validateMessage,
  validateObject,
  validateServerConfigurationForObject,
  validateThread,
  validateToken,
} from '../utils/validator';
import { Path } from '../utils/path';

/**
 * This class supports create messages within threads.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Messages extends FactoryBase {
  private ainize: AinizeService = AinizeService.getInstance();

  /**
   * Create a message.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {MessageCreateParams} MessageCreateParams - The parameters to create message.
   * @returns Returns a promise that resolves with both the transaction result and a list including the new message.
   */
  async create(
    objectId: string,
    tokenId: string,
    threadId: string,
    body: MessageCreateParams
  ): Promise<MessagesTransactionResult> {
    const address = this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    const assistant = await this.getAssistant(objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const serverName = this.ainize.getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const messages = await this.createMessageAndRun(serverName, threadId, assistant.id, body);

    const txBody = this.buildTxBodyForCreateMessage(threadId, messages, objectId, tokenId, address);
    const result = await sendTx(this.ain, txBody);

    return { ...result, messages };
  }

  /**
   * Updates a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {string} messageId - The ID of message.
   * @param {MessageUpdateParams} MessageUpdateParams - The parameters to update message.
   * @returns Returns a promise that resolves with both the transaction result and the updated message.
   */
  async update(
    objectId: string,
    tokenId: string,
    threadId: string,
    messageId: string,
    { metadata }: MessageUpdateParams
  ): Promise<MessageTransactionResult> {
    const address = this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);
    await validateMessage(this.ain, objectId, tokenId, address, threadId, messageId);

    const serverName = this.ainize.getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.MODIFY_MESSAGE;
    const body = {
      threadId,
      messageId,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await this.ainize.requestWithAuth<Message>(this.ain, {
      serverName,
      opType,
      data: body,
    });

    const txBody = await this.buildTxBodyForUpdateMessage(data, objectId, tokenId, address);
    const result = await sendTx(this.ain, txBody);

    return { ...result, message: data };
  }

  /**
   * Retrieves a message.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {string} messageId - The ID of message.
   * @returns Returns a promise that resolves with the message.
   */
  async get(
    objectId: string,
    tokenId: string,
    threadId: string,
    messageId: string
  ): Promise<Message> {
    const address = this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);
    await validateMessage(this.ain, objectId, tokenId, address, threadId, messageId);

    const serverName = this.ainize.getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.RETRIEVE_MESSAGE;
    const body = { threadId, messageId };

    const { data } = await this.ainize.requestWithAuth<Message>(this.ain, {
      serverName,
      opType,
      data: body,
    });

    return data;
  }

  // TODO(jiyoung): fetch from blockchain db.
  /**
   * Retrieves a list of messages.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @returns Returns a promise that resolves with the list of messages.
   */
  async list(objectId: string, tokenId: string, threadId: string): Promise<MessageMap> {
    const appId = AinftObject.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const serverName = this.ainize.getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.LIST_MESSAGES;
    const body = { threadId };

    const { data } = await this.ainize.requestWithAuth<Page<MessageMap>>(this.ain, {
      serverName,
      opType,
      data: body,
    });

    return data.data;
  }

  private async createMessageAndRun(
    serverName: string,
    threadId: string,
    assistantId: string,
    body: MessageCreateParams
  ) {
    try {
      await this.ainize.login(this.ain);
      // TODO(jiyoung): handle these actions from one endpoint.
      await this.createMessage(serverName, threadId, body);
      const run = await this.createRun(serverName, threadId, assistantId);
      await this.waitForRun(serverName, threadId, run.id);
      // TODO(jiyoung): if 'has_more=true', use cursor to fetch more data.
      const list = await this.listMessages(serverName, threadId);
      return list.data;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      await this.ainize.logout();
    }
  }

  private async createMessage(
    serverName: string,
    threadId: string,
    { role, content, metadata }: MessageCreateParams
  ) {
    const opType = OperationType.CREATE_MESSAGE;
    const body = {
      threadId,
      role,
      content,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };
    const { data } = await this.ainize.request(this.ain, { serverName, opType, data: body });
    return data;
  }

  private async createRun(serverName: string, threadId: string, assistantId: string) {
    const opType = OperationType.CREATE_RUN;
    const body = {
      threadId,
      assistantId,
    };
    const { data } = await this.ainize.request<any>(this.ain, { serverName, opType, data: body });
    return data;
  }

  private waitForRun(serverName: string, threadId: string, runId: string) {
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const opType = OperationType.RETRIEVE_RUN;
          const body = { threadId, runId };
          const response = await this.ainize.request<any>(this.ain, {
            serverName,
            opType,
            data: body,
          });
          if (response.data.status === 'completed') {
            clearInterval(interval);
            resolve();
          }
          if (
            response.data.status === 'expired' ||
            response.data.status === 'failed' ||
            response.data.status === 'cancelled'
          ) {
            clearInterval(interval);
            reject(new Error(`Run ${runId} is ${response.data}`));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 2000); // 2sec
    });
  }

  private async listMessages(serverName: string, threadId: string) {
    const opType = OperationType.LIST_MESSAGES;
    const body = { threadId };
    const { data } = await this.ainize.request<any>(this.ain, { serverName, opType, data: body });
    return data;
  }

  private buildTxBodyForCreateMessage(
    threadId: string,
    messages: MessageMap,
    objectId: string,
    tokenId: string,
    address: string
  ) {
    const appId = AinftObject.getAppId(objectId);
    const messagesPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .messages()
      .value();

    const map: { [key: string]: object } = {};

    Object.keys(messages).forEach((key) => {
      const { id, created_at, role, content, metadata } = messages[key];
      map[`${created_at}`] = {
        id,
        role,
        createdAt: created_at,
        ...(content && !_.isEmpty(content) && { content }),
        ...(metadata && !_.isEmpty(metadata) && { metadata }),
      };
    });

    return buildSetTxBody(buildSetValueOp(messagesPath, map), address);
  }

  private async buildTxBodyForUpdateMessage(
    { id, thread_id, metadata }: Message,
    objectId: string,
    tokenId: string,
    address: string
  ) {
    const appId = AinftObject.getAppId(objectId);
    const messagesPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(thread_id)
      .messages()
      .value();

    let key = null;
    const messages: MessageMap = await getValue(messagesPath, this.ain);
    for (const ts in messages) {
      if (messages[ts].id === id) {
        key = ts;
        break;
      }
    }
    if (!key) {
      throw new Error('Message not found');
    }

    const messagePath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(thread_id)
      .message(key)
      .value();
    const prev = await getValue(messagePath, this.ain);
    const value = {
      ...prev,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    return buildSetTxBody(buildSetValueOp(messagePath, value), address);
  }

  private async getAssistant(objectId: string, tokenId: string) {
    const appId = AinftObject.getAppId(objectId);
    const assistantPath = Path.app(appId).token(tokenId).ai().value();
    const assistant = await getValue(assistantPath, this.ain);
    if (!assistant) {
      throw new Error('Assistant not found');
    }
    return assistant;
  }
}
