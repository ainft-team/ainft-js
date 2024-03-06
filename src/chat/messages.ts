import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../ainft721Object';
import BlockchainBase from '../blockchainBase';
import {
  JobType,
  Message,
  MessageCreateParams,
  MessagesTransactionResult,
  MessageMap,
  MessageTransactionResult,
  MessageUpdateParams,
  Page,
  ServiceNickname,
} from '../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetTransactionBody,
  buildSetValueOp,
  getValue,
  isTransactionSuccess,
  Ref,
  sendAinizeRequest,
  sendTransaction,
  validateAndGetAssistant,
  validateAndGetService,
  validateAndGetServiceName,
  validateAssistant,
  validateMessage,
  validateObject,
  validateServiceConfiguration,
  validateThread,
  validateToken,
} from '../common/util';

/**
 * This class supports create messages within threads.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class Messages extends BlockchainBase {
  /**
   * Create a message.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @param {MessageCreateParams} MessageCreateParams - The parameters to create message.
   * @returns Returns a promise that resolves with both the transaction result and a list including the new message.
   */
  async create(
    threadId: string,
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname,
    body: MessageCreateParams
  ): Promise<MessagesTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    const { id } = await validateAndGetAssistant(appId, tokenId, serviceName, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const messages = await this.sendMessageAndReply(body, threadId, id, service);

    const txBody = this.buildTxBodyForCreateMessage(
      threadId,
      messages,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await sendTransaction(txBody, this.ain);
    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, messages };
  }

  /**
   * Updates a thread.
   * @param {string} messageId - The ID of message.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @returns Returns a promise that resolves with both the transaction result and the updated message.
   */
  async update(
    messageId: string,
    threadId: string,
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname,
    { metadata }: MessageUpdateParams
  ): Promise<MessageTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, serviceName, address, threadId, messageId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.MODIFY_MESSAGE;
    const body = {
      threadId,
      messageId,
      ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
    };
    const message = await sendAinizeRequest<Message>(jobType, body, service, this.ain, this.ainize);

    const txBody = await this.buildTxBodyForUpdateMessage(
      message,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await sendTransaction(txBody, this.ain);
    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, message };
  }

  /**
   * Retrieves a message.
   * @param {string} messageId - The ID of message.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @returns Returns a promise that resolves with the message.
   */
  async get(
    messageId: string,
    threadId: string,
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname
  ): Promise<Message> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, serviceName, address, threadId, messageId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.RETRIEVE_MESSAGE;
    const body = { jobType, threadId, messageId };
    const message = await sendAinizeRequest<Message>(jobType, body, service, this.ain, this.ainize);

    return message;
  }

  /**
   * Retrieves a list of messages.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @returns Returns a promise that resolves with the list of messages.
   */
  async list(
    threadId: string,
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname
  ): Promise<MessageMap> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.LIST_MESSAGES;
    const body = { threadId };
    const { data } = await sendAinizeRequest<Page<MessageMap>>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    return data;
  }

  private async sendMessageAndReply(
    { role, content, metadata }: MessageCreateParams,
    threadId: string,
    assistantId: string,
    service: Service
  ) {
    try {
      await ainizeLogin(this.ain, this.ainize);
      const message = await this.createMessage(threadId, role, content, service, metadata);
      const run = await this.createRun(threadId, assistantId, service);
      await this.waitForRun(threadId, run.id, service);
      // TODO(jiyoung): if 'has_more=true', use cursor to fetch more data.
      const list = await this.listMessages(threadId, service);
      return list.data;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      await ainizeLogout(this.ainize);
    }
  }

  private async createMessage(
    threadId: string,
    role: 'user',
    content: string,
    service: Service,
    metadata?: object | null
  ) {
    const { status, data } = await service.request({
      jobType: JobType.CREATE_MESSAGE,
      threadId,
      role,
      content,
      ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
    });
    // TODO(jiyoung): extract failure handling to util function.
    if (status === 'FAIL') {
      throw new Error(`Failed to create message: ${JSON.stringify(data)}`);
    }
    return data;
  }

  private async createRun(threadId: string, assistantId: string, service: Service) {
    const { status, data } = await service.request({
      jobType: JobType.CREATE_RUN,
      threadId,
      assistantId,
    });
    // TODO(jiyoung): extract failure handling to util function.
    if (status === 'FAIL') {
      throw new Error(`Failed to create message: ${JSON.stringify(data)}`);
    }
    return data;
  }

  private waitForRun(threadId: string, runId: string, service: Service) {
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response = await service.request({
            jobType: JobType.RETRIEVE_RUN,
            threadId,
            runId,
          });
          // TODO(jiyoung): extract failure handling to util function.
          if (response.status === 'FAIL') {
            clearInterval(interval);
            reject(new Error(`Failed to retrieve run: ${JSON.stringify(response.data)}`));
          }
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

  private async listMessages(threadId: string, service: Service) {
    const { status, data } = await service.request({
      jobType: JobType.LIST_MESSAGES,
      threadId,
    });
    // TODO(jiyoung): extract failure handling to util function.
    if (status === 'FAIL') {
      throw new Error(`Failed to create message: ${JSON.stringify(data)}`);
    }
    return data;
  }

  private buildTxBodyForCreateMessage(
    threadId: string,
    messages: MessageMap,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const ref = Ref.app(appId)
      .token(tokenId)
      .ai(serviceName)
      .history(address)
      .thread(threadId)
      .messages();
    const value: { [key: string]: object } = {};

    Object.keys(messages).forEach((key) => {
      const { id, created_at, role, content, metadata } = messages[key];
      value[`${created_at}`] = {
        id,
        role,
        ...(content && Object.keys(content).length > 0 && { content }),
        ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
      };
    });

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }

  private async buildTxBodyForUpdateMessage(
    message: Message,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const { id, thread_id, metadata } = message;
    const messagesPath = Ref.app(appId)
      .token(tokenId)
      .ai(serviceName)
      .history(address)
      .thread(thread_id)
      .messages();
    const messages: MessageMap = await getValue(messagesPath, this.ain);

    // TODO(jiyoung): optimize inefficient loop.
    let timestamp: string | undefined;
    for (const key in messages) {
      if (messages[key].id === id) {
        timestamp = key;
        break;
      }
    }

    const ref = Ref.app(appId)
      .token(tokenId)
      .ai(serviceName)
      .history(address)
      .thread(thread_id)
      .message(timestamp!);
    const prev = await getValue(ref, this.ain);

    const value = {
      ...prev,
      ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
    };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }
}
