import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../../../ainft721Object';
import {
  MessageCreateParams,
  MessageTransactionResult,
  ThreadMessage,
} from '../../../types';
import {
  Ref,
  buildSetValueTransactionBody,
  validateAiConfig,
  validateAndGetAiName,
  validateAndGetTokenAi,
  validateObject,
  validateThread,
  validateToken,
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
    {
      objectId,
      tokenId,
      provider,
      api,
      role,
      content,
      metadata,
    }: MessageCreateParams
  ): Promise<MessageTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateAndGetTokenAi(appId, tokenId, aiName, null, this.ain);

    await validateThread(appId, tokenId, aiName, address, threadId, this.ain);

    const message = <ThreadMessage>{
      id: 'msg_000000000000000000000001',
      thread_id: 'thread_000000000000000000000001',
      role: 'user',
      content: [{ type: 'text', text: content }],
      assistant_id: null,
      run_id: null,
      metadata: metadata || {},
      created_at: 0,
    };

    const txBody = this.getMessageCreateTxBody(
      appId,
      tokenId,
      aiName,
      address,
      message
    );

    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, message };
  }

  private getMessageCreateTxBody(
    appId: string,
    tokenId: string,
    aiName: string,
    address: string,
    message: ThreadMessage
  ) {
    const content =
      message.content[0].type === 'text'
        ? message.content[0].text
        : message.content[0].image_file;

    const messageRef = Ref.app(appId)
      .token(tokenId)
      .ai(aiName)
      .history(address)
      .thread(message.thread_id)
      .message(message.id);

    return buildSetValueTransactionBody(messageRef, {
      role: message.role,
      content: content,
      ...(message.metadata &&
        !(Object.keys(message.metadata).length === 0) && {
          metadata: message.metadata,
        }),
    });
  }
}
