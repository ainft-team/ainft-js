import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../../ainft721Object';
import BlockchainBase from '../../blockchainBase';
import {
  Message,
  MessageCreateParams,
  MessageListTransactionResult,
  MessageTransactionResult,
  MessageUpdateParams,
  JobType,
  ServiceProvider,
} from '../../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetTransactionBody,
  buildSetValueOp,
  getValue,
  isTransactionSuccess,
  Ref,
  sendRequestToService,
  sendTransaction,
  validateAndGetAssistant,
  validateAndGetService,
  validateAndGetServiceName,
  validateAssistant,
  validateMessage,
  validateObject,
  validateObjectServiceConfig,
  validateThread,
  validateToken,
} from '../../util';

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
   * @param {ServiceProvider} provider - The service provider to use.
   * @param {MessageCreateParams} MessageCreateParams - The parameters to create message.
   * @returns Returns a promise that resolves with both the transaction result and a list including the new message.
   */
  async create(
    threadId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider,
    { role, content, metadata }: MessageCreateParams
  ): Promise<MessageListTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    const { id: assistantId } = await validateAndGetAssistant(appId, tokenId, serviceName, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const message = await this.createMessage(threadId, role, content, service, metadata);
    const run = await this.createRun(threadId, assistantId, service);
    await this.waitForRun(threadId, run.id, service);
    const messages = await this.listMessages(threadId, service);

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForCreateMessage(threadId, messages, appId, tokenId, serviceName, address);
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
   * @param {ServiceProvider} provider - The service provider to use.
   * @returns Returns a promise that resolves with both the transaction result and the updated message.
   */
  async update(
    messageId: string,
    threadId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider,
    { metadata }: MessageUpdateParams
  ): Promise<MessageTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, serviceName, address, threadId, messageId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.MODIFY_MESSAGE;
    const body = {
      threadId,
      messageId,
      ...(metadata && { metadata }),
    };

    const message = await sendRequestToService<Message>(jobType, body, service, this.ain, this.ainize);

    const txBody = await this.buildTxBodyForUpdateMessage(message, appId, tokenId, serviceName, address);
    const txResult = await sendTransaction(txBody, this.ain);

    return { ...txResult, message };
  }

  /**
   * Retrieves a message.
   * @param {string} messageId - The ID of message.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @returns Returns a promise that resolves with the message.
   */
  async get(
    messageId: string,
    threadId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider
  ): Promise<Message> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, serviceName, address, threadId, messageId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.RETRIEVE_MESSAGE;
    const body = { jobType, threadId, messageId };

    const message = await sendRequestToService<Message>(jobType, body, service, this.ain, this.ainize);

    return message;
  }

  /**
   * Retrieves a list of messages.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @returns Returns a promise that resolves with the list of messages.
   */
  async list(
    threadId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider
  ): Promise<Array<Message>> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.LIST_MESSAGES;
    const body = { threadId };

    const messages = await sendRequestToService<Array<Message>>(jobType, body, service, this.ain, this.ainize);

    return messages;
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
      ...(metadata && { metadata }),
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
      }, 1000); // 1sec
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
    messages: Array<Message>,
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

    messages.forEach((el) => {
      value[el.id] = {
        role: el.role,
        content: el.content[0].type === 'text' ? el.content[0].text : el.content[0].image_file,
        ...(el.metadata &&
          Object.keys(el.metadata).length && {
            metadata: el.metadata,
          }),
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
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).history(address).thread(thread_id).message(id);
    const prev = await getValue(ref, this.ain);

    const value = {
      ...prev,
      ...(metadata && Object.keys(metadata).length && { metadata }),
    };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }
}
