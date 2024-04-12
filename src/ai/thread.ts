import Ainft721Object from '../ainft721Object';
import BlockchainBase from '../blockchainBase';
import {
  JobType,
  PageParams,
  ServiceNickname,
  Thread,
  ThreadCreateAndSendParams,
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
  sendAinizeRequest,
  sendTransaction,
  validateAndGetService,
  validateAndGetServiceName,
  validateAssistant,
  validateObject,
  validateServiceConfiguration,
  validateThread,
  validateToken,
} from '../utils/util';

/**
 * This class supports create threads that assistant can interact with.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Threads extends BlockchainBase {
  /**
   * Create a thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @param {ThreadCreateParams} ThreadCreateParams - The parameters to create thread.
   * @returns Returns a promise that resolves with both the transaction result and the created thread.
   */
  async create(
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname,
    { metadata }: ThreadCreateParams
  ): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.CREATE_THREAD;
    const body = { ...(metadata && Object.keys(metadata).length > 0 && { metadata }) };
    const thread = await sendAinizeRequest<Thread>(jobType, body, service, this.ain, this.ainize);

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
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @param {ThreadUpdateParams} ThreadUpdateParams - The parameters to update thread.
   * @returns Returns a promise that resolves with both the transaction result and the updated thread.
   */
  async update(
    threadId: string,
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname,
    { metadata }: ThreadUpdateParams
  ): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.MODIFY_THREAD;
    const body = { threadId, ...(metadata && Object.keys(metadata).length > 0 && { metadata }) };
    const thread = await sendAinizeRequest<Thread>(jobType, body, service, this.ain, this.ainize);

    const txBody = await this.buildTxBodyForUpdateThread(
      thread,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await sendTransaction(txBody, this.ain);
    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, thread };
  }

  /**
   * Deletes a thread.
   * @param {string} threadId - The ID of thread.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @returns Returns a promise that resolves with both the transaction result and the deleted thread.
   */
  async delete(
    threadId: string,
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname
  ): Promise<ThreadDeleteTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.DELETE_THREAD;
    const body = { threadId };
    const delThread = await sendAinizeRequest<ThreadDeleted>(
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
   * @param {ServiceNickname} nickname - The service nickname to use.
   * @returns Returns a promise that resolves with the thread.
   */
  async get(
    threadId: string,
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname
  ): Promise<Thread> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);
    await validateThread(appId, tokenId, serviceName, address, threadId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.RETRIEVE_THREAD;
    const body = { threadId };
    const thread = await sendAinizeRequest<Thread>(jobType, body, service, this.ain, this.ainize);

    return thread;
  }

  async list(
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname,
    { offset, limit, order }: PageParams
  ) {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = await validateAndGetServiceName(nickname, this.ainize);
    await validateServiceConfiguration(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, null, this.ain);

    return {
      total: 2,
      items: [
        {
          id: 'thread_yjw3LcSxSxIkrk225v7kLpCA',
          metadata: { title: '도와드릴까요?' },
          created_at: 1711962854, // metadata
          updated_at: 1711962854, // metadata
        },
        {
          id: 'thread_mmzBrZeM5vllqEceRttvu1xk',
          metadata: { title: '영문번역' },
          created_at: 1711961028, // metadata
          updated_at: 1711961028, // metadata
        },
      ],
    };
  }

  async createAndSend(
    objectId: string,
    tokenId: string,
    nickname: ServiceNickname,
    { thread, message }: ThreadCreateAndSendParams
  ) {
    return {
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
      thread: {
        id: 'thread_yjw3LcSxSxIkrk225v7kLpCA',
        metadata: { title: '도와드릴까요?' },
        created_at: 1711962854, // metadata
        updated_at: 1711962854, // metadata
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
          created_at: 1711967047,
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
      ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
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
      ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
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
