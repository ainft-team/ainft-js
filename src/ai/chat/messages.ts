import Service from '@ainize-team/ainize-js/dist/service';

import Ainft721Object from '../../ainft721Object';
import BlockchainBase from '../../blockchainBase';
import {
  MessageCreateParams,
  MessageCreateTransactionResult,
  MessageTransactionResult,
  MessageUpdateParams,
  OpenAIJobType,
  Message,
  ServiceProvider,
} from '../../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetTransactionBody,
  buildSetValueOp,
  getValue,
  Ref,
  validateAndGetAssistant,
  validateAndGetService,
  validateAndGetServiceName,
  validateAssistant,
  validateMessage,
  validateObject,
  validateServiceConfig,
  validateThread,
  validateToken,
} from '../../util';

export default class Messages extends BlockchainBase {
  async create(
    threadId: string,
    objectId: string,
    tokenId: string,
    { provider, role, content, metadata }: MessageCreateParams
  ): Promise<MessageCreateTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateServiceConfig(appId, serviceName, this.ain);
    const { id } = await validateAndGetAssistant(appId, tokenId, serviceName, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const message = await this.createMessage(threadId, role, content, service, metadata);
    const run = await this.createRun(threadId, id, service);
    await this.waitForRun(threadId, run.id, service);
    const messages = await this.listMessages(threadId, service);

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForCreateMessage(
      threadId,
      messages,
      appId,
      tokenId,
      serviceName,
      address
    );
    const txResult = await this.ain.sendTransaction(txBody);

    return { ...txResult, messages };
  }

  async update(
    messageId: string,
    threadId: string,
    objectId: string,
    tokenId: string,
    { provider, metadata }: MessageUpdateParams
  ): Promise<MessageTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, serviceName, address, threadId, messageId, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const jobType = OpenAIJobType.MODIFY_MESSAGE;
    const body = {
      jobType,
      thread_id: threadId,
      message_id: messageId,
      ...(metadata && { metadata }),
    };
    const newMessage = await service.request(body);

    await ainizeLogout(this.ainize);

    const txBody = await this.buildTxBodyForUpdateMessage(
      newMessage,
      appId,
      tokenId,
      serviceName,
      address
    );
    const txResult = await this.ain.sendTransaction(txBody);

    return { ...txResult, message: newMessage };
  }

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
    await validateServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, serviceName, address, threadId, messageId, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const jobType = OpenAIJobType.RETRIEVE_MESSAGE;
    const body = { jobType, thread_id: threadId, message_id: messageId };
    const message = await service.request(body);

    await ainizeLogout(this.ainize);

    return message;
  }

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
    await validateServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const messages = await this.listMessages(threadId, service);

    await ainizeLogout(this.ainize);

    return messages;
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
          !(Object.keys(el.metadata).length === 0) && {
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
    aiName: string,
    address: string
  ) {
    const { id, thread_id, metadata } = message;
    const ref = Ref.app(appId)
      .token(tokenId)
      .ai(aiName)
      .history(address)
      .thread(thread_id)
      .message(id);
    const prev = await getValue(ref, this.ain);

    const value = {
      ...prev,
      ...(metadata && Object.keys(metadata).length && { metadata }),
    };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }

  private createMessage(
    threadId: string,
    role: 'user',
    content: string,
    service: Service,
    metadata?: object | null
  ) {
    return service.request({
      jobType: OpenAIJobType.CREATE_MESSAGE,
      threadId,
      role,
      content,
      ...(metadata && { metadata }),
    });
  }

  private createRun(threadId: string, assistantId: string, service: Service) {
    return service.request({
      jobType: OpenAIJobType.CREATE_RUN,
      threadId,
      assistantId,
    });
  }

  private waitForRun(threadId: string, runId: string, service: Service) {
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        const run = await service.request({
          jobType: OpenAIJobType.RETRIEVE_RUN,
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
      jobType: OpenAIJobType.LIST_MESSAGES,
      thread_id: threadId,
    });
  }
}
