import _ from 'lodash';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getServiceName, request } from '../ainize';
import {
  Message,
  MessageCreateParams,
  MessagesTransactionResult,
  MessageMap,
  MessageTransactionResult,
  MessageUpdateParams,
} from '../types';
import { Path } from '../utils/path';
import { buildSetValueOp, buildSetOp, buildSetTxBody, sendTx } from '../utils/transaction';
import { getAssistant, getValue } from '../utils/util';
import {
  validateAssistant,
  validateMessage,
  validateObject,
  validateServerConfigurationForObject,
  validateThread,
  validateToken,
} from '../utils/validator';

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
   * @returns A promise that resolves with both the transaction result and a list including the new message.
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

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const assistant = await getAssistant(this.ain, appId, tokenId);
    const newMessages = await this.sendMessage(serviceName, threadId, assistant.id, address, body);
    const allMessages = await this.getAllMessages(appId, tokenId, address, threadId, newMessages);

    const txBody = await this.buildTxBodyForCreateMessage(
      address,
      objectId,
      tokenId,
      threadId,
      allMessages
    );
    const result = await sendTx(txBody, this.ain);

    return { ...result, messages: allMessages };
  }

  /**
   * Updates a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {string} messageId - The ID of message.
   * @param {MessageUpdateParams} MessageUpdateParams - The parameters to update message.
   * @returns A promise that resolves with both the transaction result and the updated message.
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

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.MODIFY_MESSAGE;
    const body = {
      threadId,
      messageId,
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await request<Message>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const txBody = await this.buildTxBodyForUpdateMessage(data, objectId, tokenId, address);
    const result = await sendTx(txBody, this.ain);

    return { ...result, message: data };
  }

  /**
   * Retrieves a message.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {string} messageId - The ID of message.
   * @param {string} address - The checksum address of account.
   * @returns A promise that resolves with the message.
   */
  async get(
    objectId: string,
    tokenId: string,
    threadId: string,
    messageId: string,
    address: string
  ): Promise<Message> {
    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const appId = AinftObject.getAppId(objectId);
    const messagesPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .messages()
      .value();
    const messages: MessageMap = await getValue(this.ain, messagesPath);
    const key = this.findMessageKey(messages, messageId);

    return messages[key];
  }

  /**
   * Retrieves a list of messages.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} threadId - The ID of thread.
   * @param {string} address - The checksum address of account.
   * @returns A promise that resolves with the list of messages.
   */
  async list(
    objectId: string,
    tokenId: string,
    threadId: string,
    address: string
  ): Promise<MessageMap> {
    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId);
    await validateThread(this.ain, objectId, tokenId, address, threadId);

    const appId = AinftObject.getAppId(objectId);
    const messagesPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .messages()
      .value();
    const messages = await this.ain.db.ref(messagesPath).getValue();

    return messages;
  }

  private async sendMessage(
    serviceName: string,
    threadId: string,
    assistantId: string,
    address: string,
    params: MessageCreateParams
  ) {
    try {
      const opType = OperationType.SEND_MESSAGE;
      const body = { ...params, threadId, assistantId, address };
      const { data } = await request<any>(this.ainize!, { serviceName, opType, data: body });
      return data.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private async buildTxBodyForCreateMessage(
    address: string,
    objectId: string,
    tokenId: string,
    threadId: string,
    messages: any
  ) {
    const appId = AinftObject.getAppId(objectId);
    const messagesPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .messages()
      .value();
    const threadPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .value();

    const prev = (await this.ain.db.ref(`${threadPath}/metadata`).getValue()) || {};

    const messageKeys = Object.keys(messages);
    const lastMessageKey = messageKeys[messageKeys.length - 1];

    const defaultTitle = 'New chat';
    const lastMessage = messages[lastMessageKey]?.content[0]?.text?.value || defaultTitle;

    const maxLength = 10;
    const title =
      lastMessage.length > maxLength ? lastMessage.substring(0, maxLength) + '...' : lastMessage;

    const setMessageInfoOp = buildSetValueOp(messagesPath, messages);
    const setThreadTitleOp = buildSetValueOp(`${threadPath}/metadata`, {
      ...prev,
      title,
    });

    return buildSetTxBody(buildSetOp([setThreadTitleOp, setMessageInfoOp]), address);
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

  private async getAllMessages(
    appId: string,
    tokenId: string,
    address: string,
    threadId: string,
    newMessages: MessageMap
  ) {
    let messages: { [key: string]: any } = {};
    const messagesPath = Path.app(appId)
      .token(tokenId)
      .ai()
      .history(address)
      .thread(threadId)
      .messages()
      .value();

    const prev = await this.ain.db.ref(messagesPath).getValue();
    if (_.isObject(prev) && !_.isEmpty(prev)) {
      messages = {
        ...prev,
      };
    }
    Object.keys(newMessages).forEach((key) => {
      const { id, created_at, role, content, metadata } = newMessages[key];
      messages[`${created_at}`] = {
        id,
        role,
        createdAt: created_at,
        ...(content && !_.isEmpty(content) && { content }),
        ...(metadata && !_.isEmpty(metadata) && { metadata }),
      };
    });

    return messages;
  }

  private findMessageKey = (messages: MessageMap, messageId: string) => {
    let messageKey = null;
    for (const key in messages) {
      if (messages[key].id === messageId) {
        messageKey = key;
        break;
      }
    }
    if (!messageKey) {
      throw new Error('Message not found');
    }
    return messageKey;
  };
}
