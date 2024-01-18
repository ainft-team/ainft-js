import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../../../ainft721Object';
import {
  MessageCreateParams,
  MessageCreateTransactionResult,
  MessageTransactionResult,
  MessageUpdateParams,
  ThreadMessage,
} from '../../../types';
import {
  Ref,
  buildSetTransactionBody,
  buildSetValueOp,
  getValue,
  validateAiConfig,
  validateAndGetAiName,
  validateAndGetTokenAi,
  validateMessage,
  validateObject,
  validateThread,
  validateToken,
  validateTokenAi,
} from '../../../util';

export default class Messages {
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  async create(
    threadId: string,
    { objectId, tokenId, provider, api, role, content, metadata }: MessageCreateParams
  ): Promise<MessageCreateTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAiConfig(appId, aiName, this.ain);
    const { id: aiId } = await validateAndGetTokenAi(appId, tokenId, aiName, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);

    // TODO(jiyoung): create message.
    // const message = await this.openai.beta.threads.messages.create(
    //   threadId,
    //   { role: role, content: content }
    // );

    // TODO(jiyoung): create run.
    // const run = await this.openai.beta.threads.runs.create(threadId, {
    //   assistant_id: aiId,
    // });

    // TODO(jiyoung): retrieve run until run status is 'completed'.
    // await this.waitForRun(threadId, run.id);

    // TODO(jiyoung): retrieve message list.
    // const messages = await this.openai.beta.threads.messages.list(threadId);
    const messages: Array<ThreadMessage> = [
      {
        id: 'msg_000000000000000000000002',
        thread_id: 'thread_000000000000000000000001',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'I am an AI developed by OpenAI',
          },
        ],
        assistant_id: 'asst_000000000000000000000001',
        run_id: 'run_000000000000000000000001',
        metadata: {},
        created_at: 1,
      },
      {
        id: 'msg_000000000000000000000001',
        thread_id: 'thread_000000000000000000000001',
        role: 'user',
        content: [{ type: 'text', text: content }],
        assistant_id: null,
        run_id: null,
        metadata: metadata || {},
        created_at: 0,
      },
    ];

    const txBody = this.buildTxBodyForCreateMessage(
      threadId,
      messages,
      appId,
      tokenId,
      aiName,
      address
    );

    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, messages };
  }

  async update(
    threadId: string,
    messageId: string,
    { objectId, tokenId, provider, api, metadata }: MessageUpdateParams
  ): Promise<MessageTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, null, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, aiName, address, threadId, messageId, this.ain);

    // TODO(jiyoung): update message.
    const message = <ThreadMessage>{
      id: 'msg_000000000000000000000001',
      thread_id: 'thread_000000000000000000000001',
      role: 'user',
      content: [{ type: 'text', text: 'hello' }],
      assistant_id: null,
      run_id: null,
      metadata: metadata || {},
      created_at: 0,
    };

    const txBody = await this.buildTxBodyForUpdateMessage(message, appId, tokenId, aiName, address);

    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, message };
  }

  async get(
    threadId: string,
    messageId: string,
    objectId: string,
    provider: string,
    api: string,
    tokenId: string
  ): Promise<ThreadMessage> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, null, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);
    await validateMessage(appId, tokenId, aiName, address, threadId, messageId, this.ain);

    // TODO(jiyoung): get message.
    const message = <ThreadMessage>{
      id: 'msg_000000000000000000000001',
      thread_id: 'thread_000000000000000000000001',
      role: 'user',
      content: [{ type: 'text', text: 'hello' }],
      assistant_id: null,
      run_id: null,
      metadata: {},
      created_at: 0,
    };

    return message;
  }

  async list(
    threadId: string,
    objectId: string,
    provider: string,
    api: string,
    tokenId: string
  ): Promise<Array<ThreadMessage>> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, null, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);

    // TODO(jiyoung): retrieve message list.
    // const messages = await this.openai.beta.threads.messages.list(threadId);
    const messages: Array<ThreadMessage> = [
      {
        id: 'msg_000000000000000000000002',
        thread_id: 'thread_000000000000000000000001',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'I am an AI developed by OpenAI',
          },
        ],
        assistant_id: 'asst_000000000000000000000001',
        run_id: 'run_000000000000000000000001',
        metadata: {},
        created_at: 1,
      },
      {
        id: 'msg_000000000000000000000001',
        thread_id: 'thread_000000000000000000000001',
        role: 'user',
        content: [{ type: 'text', text: 'Hello, what is your name?' }],
        assistant_id: null,
        run_id: null,
        metadata: {},
        created_at: 0,
      },
    ];

    return messages;
  }

  private buildTxBodyForCreateMessage(
    threadId: string,
    messages: Array<ThreadMessage>,
    appId: string,
    tokenId: string,
    aiName: string,
    address: string
  ) {
    const ref = Ref.app(appId)
      .token(tokenId)
      .ai(aiName)
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

    const setValueOp = buildSetValueOp(ref, value);
    return buildSetTransactionBody(setValueOp, address);
  }

  private async buildTxBodyForUpdateMessage(
    message: ThreadMessage,
    appId: string,
    tokenId: string,
    aiName: string,
    address: string
  ) {
    const ref = Ref.app(appId)
      .token(tokenId)
      .ai(aiName)
      .history(address)
      .thread(message.thread_id)
      .message(message.id);

    const prev = await getValue(ref, this.ain);
    const value = {
      ...prev,
      ...(message.metadata &&
        !(Object.keys(message.metadata).length === 0) && {
          metadata: message.metadata,
        }),
    };

    const setValueOp = buildSetValueOp(ref, value);
    return buildSetTransactionBody(setValueOp, address);
  }

  // private waitForRun(threadId: string, runId: string) {
  //   return new Promise<void>((resolve, reject) => {
  //     const interval = setInterval(async () => {
  //       // TODO(jiyoung): replace with ainize.request() method.
  //       const run = await this.openai.beta.threads.runs.retrieve(
  //         threadId,
  //         runId
  //       );
  //       if (run.status === 'completed') {
  //         clearInterval(interval);
  //         resolve();
  //       }
  //       if (
  //         run.status === 'expired' ||
  //         run.status === 'failed' ||
  //         run.status === 'cancelled'
  //       ) {
  //         clearInterval(interval);
  //         reject(new Error(`Run ${runId} is ${run.status}`));
  //       }
  //     }, 1000); // 1s
  //   });
  // }
}
