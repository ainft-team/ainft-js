import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../../ainft721Object';
import {
  Assistant,
  AssistantCreateParams,
  AssistantTransactionResult,
  AssistantUpdateParams,
} from '../../types';
import {
  buildSetValueTransactionBody,
  validateAi,
  validateObject,
  validateObjectOwnership,
  validateToken,
  validateAndGetAiName,
  validateAndGetAiService,
  validateTokenAi,
  Ref,
  getValue,
} from '../../util';

export default class Assistants {
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  async create({
    config,
    description,
    instructions,
    metadata,
    model,
    name,
    tokenId,
  }: AssistantCreateParams): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwnership(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAi(appId, aiName, this.ain);

    const ai = await validateAndGetAiService(aiName, this.ainize);

    // TODO(jiyoung): replace with ainize.request() function after deployment of ainize service.
    // const response = await ai.request(<REQUEST_DATA>);
    // NOTE(jiyoung): mocked assistant.
    const assistant = {
      id: 'asst_000000000000000000000001',
      model: model,
      name: name,
      instructions: instructions,
      description: description || null,
      metadata: metadata || {},
      created_at: 0,
    };

    const txBody = this.getAssistantCreateTxBody(
      appId,
      tokenId,
      aiName,
      assistant
    );

    // TODO(jiyoung): implement failure handling logic.
    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, assistant: assistant };
  }

  async update(
    assistantId: string,
    {
      config,
      description,
      instructions,
      metadata,
      model,
      name,
      tokenId,
    }: AssistantUpdateParams
  ): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwnership(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAi(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, assistantId, this.ain);

    const ai = await validateAndGetAiService(aiName, this.ainize);

    // TODO(jiyoung): replace with ainize.request() function after deployment of ainize service.
    // const response = await ai.request(<REQUEST_DATA>);
    // NOTE(jiyoung): mocked assistant.
    const assistant = {
      id: 'asst_000000000000000000000001',
      ...{ model: model || 'gpt-3.5-turbo' },
      ...{ name: name || 'name' },
      ...{ instructions: instructions || 'instructions' },
      ...{ description: description || null },
      ...{ metadata: metadata || {} },
      created_at: 0,
    };

    const txBody = await this.getAssistantUpdateTxBody(
      appId,
      tokenId,
      aiName,
      assistant
    );

    // TODO(jiyoung): implement failure handling logic.
    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, assistant: assistant };
  }

  private getAssistantCreateTxBody(
    appId: string,
    tokenId: string,
    aiName: string,
    assistant: Assistant
  ) {
    const tokenAiRef = Ref.app(appId).token(tokenId).ai(aiName).root();
    return buildSetValueTransactionBody(tokenAiRef, {
        id: assistant.id,
        config: {
          model: assistant.model,
          name: assistant.name,
          instructions: assistant.instructions,
          ...(assistant.description && { description: assistant.description }),
        ...(!(Object.keys(assistant.metadata).length === 0) && {
          metadata: assistant.metadata,
        }),
      },
    });
  }

  private async getAssistantUpdateTxBody(
    appId: string,
    tokenId: string,
    aiName: string,
    assistant: Assistant
  ) {
    const tokenAiConfigRef = Ref.app(appId).token(tokenId).ai(aiName).config();
    return buildSetValueTransactionBody(tokenAiConfigRef, {
      model: assistant.model,
      name: assistant.name,
      instructions: assistant.instructions,
      ...(assistant.description && { description: assistant.description }),
      ...(!(Object.keys(assistant.metadata).length === 0) && {
        metadata: assistant.metadata,
      }),
    });
  }
}
