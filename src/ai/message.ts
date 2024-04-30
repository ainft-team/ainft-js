import _ from 'lodash';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getServerName, login, logout, request, requestWithAuth } from '../ainize';
import {
  Message,
  MessageCreateParams,
  MessagesTransactionResult,
  MessageMap,
  MessageTransactionResult,
  MessageUpdateParams,
  Page,
} from '../types';
import { buildSetTxBody, buildSetValueOp, getAssistant, getValue, sendTx } from '../utils/util';
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
    const appId = AinftObject.getAppId(objectId);
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const assistant = await getAssistant(this.ain, appId, tokenId);
    const messages = await this.createMessageAndRun(serverName, threadId, assistant.id, body);

    const txBody = this.buildTxBodyForCreateMessage(address, objectId, tokenId, threadId, messages);
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
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);
    await validateMessage(this.ain, objectId, tokenId, address, threadId, messageId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.MODIFY_MESSAGE;
    const body = {
      threadId,
      messageId,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await requestWithAuth<Message>(this.ainize!, this.ain, {
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
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);
    await validateMessage(this.ain, objectId, tokenId, address, threadId, messageId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.RETRIEVE_MESSAGE;
    const body = { threadId, messageId };

    const { data } = await requestWithAuth<Message>(this.ainize!, this.ain, {
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
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.LIST_MESSAGES;
    const body = { threadId };

    const { data } = await requestWithAuth<Page<MessageMap>>(this.ainize!, this.ain, {
      serverName,
      opType,
      data: body,
    });

    return data?.data || {};
  }

  private async createMessageAndRun(
    serverName: string,
    threadId: string,
    assistantId: string,
    body: MessageCreateParams
  ) {
    try {
      await login(this.ainize!, this.ain);
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
      await logout(this.ainize!);
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
    const { data } = await request<any>(this.ainize!, { serverName, opType, data: body });
    return data;
  }

  private async createRun(serverName: string, threadId: string, assistantId: string) {
    const opType = OperationType.CREATE_RUN;
    const body = { threadId, assistantId };
    const { data } = await request<any>(this.ainize!, { serverName, opType, data: body });
    return data;
  }

  private waitForRun(serverName: string, threadId: string, runId: string) {
    return new Promise<void>((resolve, reject) => {
      const retrieveRun = async () => {
        try {
          const opType = OperationType.RETRIEVE_RUN;
          const body = { threadId, runId };
          const response = await request<any>(this.ainize!, {
            serverName,
            opType,
            data: body,
          });
          if (response.data.status === 'completed') {
            resolve();
          } else if (
            response.data.status === 'expired' ||
            response.data.status === 'failed' ||
            response.data.status === 'cancelled'
          ) {
            reject(new Error(`Run ${runId} is ${JSON.stringify(response.data)}`));
          } else {
            setTimeout(retrieveRun, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };
      retrieveRun();
    });
  }

  private async listMessages(serverName: string, threadId: string) {
    const opType = OperationType.LIST_MESSAGES;
    const body = { threadId };
    const { data } = await request<any>(this.ainize!, { serverName, opType, data: body });
    return data;
  }

  private buildTxBodyForCreateMessage(
    address: string,
    objectId: string,
    tokenId: string,
    threadId: string,
    messages: MessageMap
  ) {
    const appId = AinftObject.getAppId(objectId);
    const messagesPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .messages()
      .value();

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

    return buildSetTxBody(buildSetValueOp(messagesPath, newMessages), address);
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
    const messages: MessageMap = await getValue(this.ain, messagesPath);
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
    const prev = await getValue(this.ain, messagePath);
    const value = {
      ...prev,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    return buildSetTxBody(buildSetValueOp(messagePath, value), address);
  }
}
