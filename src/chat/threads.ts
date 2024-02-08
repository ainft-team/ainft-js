import Ainft721Object from '../ainft721Object';
import BlockchainBase from '../blockchainBase';
import {
  JobType,
  ServiceProvider,
  Thread,
  ThreadCreateParams,
  ThreadDeleteTransactionResult,
  ThreadDeleted,
  ThreadTransactionResult,
  ThreadUpdateParams,
} from '../types';
import {
  buildSetTransactionBody,
  buildSetValueOp,
  getValue,
  isTransactionSuccess,
  Ref,
  sendRequestToService,
  sendTransaction,
  validateAndGetService,
  validateAndGetServiceName,
  validateAssistant,
  validateObject,
  validateObjectServiceConfig,
  validateThread,
  validateToken,
} from '../util';

/**
 * This class supports create threads that assistant can interact with.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class Threads extends BlockchainBase {
  /**
   * Create a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @param {ThreadCreateParams} ThreadCreateParams - The parameters to create thread.
   * @returns Returns a promise that resolves with both the transaction result and the created thread.
   */
  async create(
    objectId: string,
    tokenId: string,
    provider: ServiceProvider,
    { metadata }: ThreadCreateParams
  ): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.CREATE_THREAD;
    const body = { ...(metadata && { metadata }) };

    const thread = await sendRequestToService<Thread>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    const txBody = this.buildTxBodyForCreateThread(thread, appId, tokenId, serviceName, address);
    const result = await sendTransaction(txBody, this.ain);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, thread };
  }

  /**
   * Updates a thread.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @param {ThreadUpdateParams} ThreadUpdateParams - The parameters to update thread.
   * @returns Returns a promise that resolves with both the transaction result and the updated thread.
   */
  async update(
    threadId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider,
    { metadata }: ThreadUpdateParams
  ): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.MODIFY_THREAD;
    const body = { threadId, ...(metadata && { metadata }) };

    const thread = await sendRequestToService<Thread>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    const txBody = await this.buildTxBodyForUpdateThread(
      thread,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await sendTransaction(txBody, this.ain);

    return { ...result, thread };
  }

  /**
   * Deletes a thread.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @returns Returns a promise that resolves with both the transaction result and the deleted thread.
   */
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
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.DELETE_THREAD;
    const body = { threadId };

    const delThread = await sendRequestToService<ThreadDeleted>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    const txBody = this.buildTxBodyForDeleteThread(threadId, appId, tokenId, serviceName, address);
    const result = await sendTransaction(txBody, this.ain);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, delThread };
  }

  /**
   * Retrieves a thread.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @returns Returns a promise that resolves with the thread.
   */
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
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.RETRIEVE_THREAD;
    const body = { threadId };

    const thread = await sendRequestToService<Thread>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

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
      ...(metadata && Object.keys(metadata).length && { metadata }),
      messages: true,
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
    const ref = Ref.app(appId)
      .token(tokenId)
      .ai(serviceName)
      .history(address)
      .thread(threadId)
      .root();

    return buildSetTransactionBody(buildSetValueOp(ref, null), address);
  }
}
