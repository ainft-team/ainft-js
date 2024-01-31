import Ainft721Object from '../../ainft721Object';
import BlockchainBase from '../../blockchainBase';
import {
  OpenAIJobType,
  ServiceProvider,
  Thread,
  ThreadCreateParams,
  ThreadDeleteTransactionResult,
  ThreadTransactionResult,
  ThreadUpdateParams,
} from '../../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetTransactionBody,
  buildSetValueOp,
  getValue,
  Ref,
  validateAndGetService,
  validateAndGetServiceName,
  validateAssistant,
  validateObject,
  validateServiceConfig,
  validateThread,
  validateToken,
} from '../../util';

export default class Threads extends BlockchainBase {
  async create(
    objectId: string,
    tokenId: string,
    { provider, metadata }: ThreadCreateParams
  ): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const jobType = OpenAIJobType.CREATE_THREAD;
    const body = { jobType, ...(metadata && { metadata }) };
    const thread = await service.request(body);

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForCreateThread(thread, appId, tokenId, serviceName, address);
    const txResult = await this.ain.sendTransaction(txBody);

    return { ...txResult, thread };
  }

  async update(
    threadId: string,
    objectId: string,
    tokenId: string,
    { provider, metadata }: ThreadUpdateParams
  ): Promise<ThreadTransactionResult> {
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

    const jobType = OpenAIJobType.MODIFY_THREAD;
    const body = { jobType, thread_id: threadId, ...(metadata && { metadata }) };
    const newThread = await service.request(body);

    await ainizeLogout(this.ainize);

    const txBody = await this.buildTxBodyForUpdateThread(
      newThread,
      appId,
      tokenId,
      serviceName,
      address
    );
    const txResult = await this.ain.sendTransaction(txBody);

    return { ...txResult, thread: newThread };
  }

  async delete(
    threadId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider
  ): Promise<ThreadDeleteTransactionResult> {
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

    const jobType = OpenAIJobType.DELETE_THREAD;
    const body = { jobType, thread_id: threadId };
    const delThread = await service.request(body);

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForDeleteThread(threadId, appId, tokenId, serviceName, address);
    const txResult = await this.ain.sendTransaction(txBody);

    return { ...txResult, delThread };
  }

  async get(
    threadId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider
  ): Promise<Thread> {
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

    const jobType = OpenAIJobType.RETRIEVE_THREAD;
    const body = {
      jobType,
      thread_id: threadId,
    };
    const thread = await service.request(body);

    await ainizeLogout(this.ainize);

    return thread;
  }

  private buildTxBodyForCreateThread(
    thread: Thread,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const { id, metadata } = thread;
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).history(address).thread(id).root();

    const value = {
      messages: true,
      ...(metadata && Object.keys(metadata).length && { metadata }),
    };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }

  private async buildTxBodyForUpdateThread(
    thread: Thread,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const { id, metadata } = thread;
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).history(address).thread(id).root();
    const prev = await getValue(ref, this.ain);

    const value = {
      ...prev,
      ...(metadata && Object.keys(metadata) && { metadata }),
    };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }

  private buildTxBodyForDeleteThread(
    threadId: string,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).history(address).thread(threadId).root();

    return buildSetTransactionBody(buildSetValueOp(ref, null), address);
  }
}
