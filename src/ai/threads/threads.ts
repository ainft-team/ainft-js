import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../../ainft721Object';
import {
  Thread,
  ThreadCreateParams,
  ThreadMessage,
  ThreadTransactionResult,
} from '../../types';
import {
  validateAi,
  validateAndGetAiName,
  validateObject,
  validateToken,
  validateAndGetTokenAi,
  Ref,
  buildSetValueTransactionBody,
} from '../../util';

export default class Threads {
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  async create({
    config,
    tokenId,
    messages,
    metadata,
  }: ThreadCreateParams): Promise<ThreadTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAi(appId, aiName, this.ain);
    await validateAndGetTokenAi(appId, tokenId, aiName, null, this.ain);

    // NOTE(jiyoung): mocked thread for test.
    const thread = <Thread>{
      id: 'thread_000000000000000000000001',
      messages:
        messages?.map<ThreadMessage>((el, i) => {
          return {
            id: 'msg_' + String(i + 1).padStart(24, '0'),
            content: el.content,
            role: 'user',
            metadata: el.metadata || {},
            created_at: 0,
          };
        }) || [],
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
      messages: thread.messages.reduce<Record<string, object>>((obj, msg) => {
        obj[msg.id] = { content: msg.content, role: msg.role };
        return obj;
      }, {}),
    });
  }
}
