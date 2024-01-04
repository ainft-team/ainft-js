import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../../ainft721Object';
import Messages from './messages/message';
import {
  Thread,
  ThreadCreateParams,
  ThreadDeleteParams,
  ThreadDeleteTransactionResult,
  ThreadTransactionResult,
  ThreadUpdateParams,
} from '../../types';
import {
  buildSetValueTransactionBody,
  validateAiConfig,
  validateAndGetAiName,
  validateObject,
  validateToken,
  validateThread,
  getValue,
  validateTokenAi,
  Ref,
} from '../../util';

export default class Threads {
  private ain: Ain;
  private ainize: Ainize;
  messages: Messages;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
    this.messages = new Messages(ain, ainize);
  }

  async create({
    config,
    tokenId,
    metadata,
  }: ThreadCreateParams): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, null, this.ain);

    // NOTE(jiyoung): mocked thread for test.
    const thread = <Thread>{
      id: 'thread_000000000000000000000001',
      metadata: metadata || {},
      created_at: 0,
    };

    // TODO(jiyoung): use ainize.request() function after deployment.
    // const ai = await validateAndGetAiService(aiName, this.ainize);
    // const response = await ai.request(<REQUEST_DATA>);

    const txBody = this.getThreadCreateTxBody(
      appId,
      tokenId,
      aiName,
      address,
      thread
    );

    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, thread };
  }

  async update(
    threadId: string,
    { config, tokenId, metadata }: ThreadUpdateParams
  ): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, null, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);

    // NOTE(jiyoung): mocked thread for test.
    const thread = <Thread>{
      id: 'thread_000000000000000000000001',
      messages: [],
      ...{ metadata: metadata || {} },
      created_at: 0,
    };

    // TODO(jiyoung): use ainize.request() function after deployment.
    // const ai = await validateAndGetAiService(aiName, this.ainize);
    // const response = await ai.request(<REQUEST_DATA>);

    const txBody = await this.getThreadUpdateTxBody(
      appId,
      tokenId,
      aiName,
      address,
      thread
    );

    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, thread };
  }

  async delete(
    threadId: string,
    { config, tokenId }: ThreadDeleteParams
  ): Promise<ThreadDeleteTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, null, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);

    // NOTE(jiyoung): mocked deleted thread for test.
    const delThread = { id: threadId, deleted: true };

    // TODO(jiyoung): use ainize.request() function after deployment.
    // const ai = await validateAndGetAiService(aiName, this.ainize);
    // const response = await ai.request(<REQUEST_DATA>);

    const txBody = this.getThreadDeleteTxBody(
      appId,
      tokenId,
      aiName,
      address,
      threadId
    );

    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, delThread };
  }

  async get(
    threadId: string,
    objectId: string,
    provider: string,
    api: string,
    tokenId: string
  ): Promise<Thread> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, null, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);

    // NOTE(jiyoung): mocked thread for test.
    const thread = {
      id: threadId,
      messages: [],
      metadata: {},
      created_at: 0,
    };

    return thread;
  }

  private getThreadCreateTxBody(
    appId: string,
    tokenId: string,
    aiName: string,
    address: string,
    thread: Thread
  ) {
    const threadRef = Ref.app(appId)
      .token(tokenId)
      .ai(aiName)
      .history(address)
      .thread(thread.id)
      .root();

    return buildSetValueTransactionBody(threadRef, {
      messages: true,
      ...(thread.metadata &&
        !(Object.keys(thread.metadata).length === 0) && {
          metadata: thread.metadata,
        }),
    });
  }

  private async getThreadUpdateTxBody(
    appId: string,
    tokenId: string,
    aiName: string,
    address: string,
    thread: Thread
  ) {
    const threadRef = Ref.app(appId)
      .token(tokenId)
      .ai(aiName)
      .history(address)
      .thread(thread.id)
      .root();

    const prev = await getValue(threadRef, this.ain);

    return buildSetValueTransactionBody(threadRef, {
      ...prev,
      ...(thread.metadata &&
        !(Object.keys(thread.metadata).length === 0) && {
          metadata: thread.metadata,
        }),
    });
  }

  private getThreadDeleteTxBody(
    appId: string,
    tokenId: string,
    aiName: string,
    address: string,
    threadId: string
  ) {
    const threadRef = Ref.app(appId)
      .token(tokenId)
      .ai(aiName)
      .history(address)
      .thread(threadId)
      .root();

    return buildSetValueTransactionBody(threadRef, null);
  }
}
