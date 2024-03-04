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
    { role, content, metadata }: MessageCreateParams
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

    await ainizeLogin(this.ain, this.ainize);

    const message = await this.createMessage(threadId, role, content, service, metadata);
    const run = await this.createRun(threadId, id, service);
    await this.waitForRun(threadId, run.id, service);
    // TODO(jiyoung): if 'has_more=true', use cursor to fetch more data.
    const list = await this.listMessages(threadId, service);
    const { data, has_more } = list;

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForCreateMessage(threadId, data, appId, tokenId, serviceName, address);
    const result = await sendTransaction(txBody, this.ain);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, messages: data };
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
      ...(metadata && Object.keys(metadata).length && { metadata }),
    };

    const message = await sendAinizeRequest<Message>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    const txBody = await this.buildTxBodyForUpdateMessage(
      message,
      appId,
      tokenId,
      serviceName,
      address
    );
    const txResult = await sendTransaction(txBody, this.ain);

    return { ...txResult, message };
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

    const message = await sendAinizeRequest<Message>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

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

    const { data } = await sendAinizeRequest<Page<MessageMap>>(jobType, body, service, this.ain, this.ainize);

    return data;
  }

  private createMessage(
    threadId: string,
    role: 'user',
    content: string,
    service: Service,
    metadata?: object | null
  ) {
    return service.request({
      jobType: JobType.CREATE_MESSAGE,
      threadId,
      role,
      content,
      ...(metadata && Object.keys(metadata).length && { metadata }),
    });
  }

  private createRun(threadId: string, assistantId: string, service: Service) {
    return service.request({
      jobType: JobType.CREATE_RUN,
      threadId,
      assistantId,
    });
  }

  private waitForRun(threadId: string, runId: string, service: Service) {
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        const run = await service.request({
          jobType: JobType.RETRIEVE_RUN,
          threadId,
          runId,
        });
        if (run.status === 'completed') {
          clearInterval(interval);
          resolve();
        }
        if (run.status === 'expired' || run.status === 'failed' || run.status === 'cancelled') {
          clearInterval(interval);
          reject(new Error(`Run ${runId} is ${run.status}`));
        }
      }, 2000); // 2sec
    });
  }

  private listMessages(threadId: string, service: Service) {
    return service.request({
      jobType: JobType.LIST_MESSAGES,
      threadId,
    });
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
        ...(content && Object.keys(content).length && { content }),
        ...(metadata && Object.keys(metadata).length && { metadata }),
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
    const messagesPath = Ref.app(appId).token(tokenId).ai(serviceName).history(address).thread(thread_id).messages();
    const messages: MessageMap = await getValue(messagesPath, this.ain);

    // TODO(jiyoung): optimize inefficient loop.
    let timestamp: string | undefined;
    for (const key in messages) {
      if (messages[key].id === id) {
        timestamp = key;
        break;
      }
    }

    const ref = Ref.app(appId).token(tokenId).ai(serviceName).history(address).thread(thread_id).message(timestamp!);
    const prev = await getValue(ref, this.ain);

    const value = {
      ...prev,
      ...(metadata && Object.keys(metadata).length && { metadata }),
    };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }
}
