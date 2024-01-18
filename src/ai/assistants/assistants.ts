import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../../ainft721Object';
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleteParams,
  AssistantDeleteTransactionResult,
  AssistantTransactionResult,
  AssistantUpdateParams,
} from '../../types';
import {
  buildSetTransactionBody,
  buildSetValueOp,
  validateAiConfig,
  validateObject,
  validateObjectOwner,
  validateToken,
  validateAndGetAiName,
  validateAndGetAiService,
  validateTokenAi,
  Ref,
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
    tokenId,
    model,
    name,
    instructions,
    description,
    metadata,
  }: AssistantCreateParams): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAiConfig(appId, aiName, this.ain);

    // NOTE(jiyoung): mocked assistant for test.
    const assistant = {
      id: 'asst_000000000000000000000001',
      model: model,
      name: name,
      instructions: instructions,
      description: description || null,
      metadata: metadata || {},
      created_at: 0,
    };

    // TODO(jiyoung): use ainize.request() function after deployment.
    // const ai = await validateAndGetAiService(aiName, this.ainize);
    // const response = await ai.request(<REQUEST_DATA>);

    const txBody = this.buildTxBodyForCreateAssistant(assistant, appId, tokenId, aiName, address);

    // TODO(jiyoung): implement failure handling logic.
    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, assistant };
  }

  async update(
    assistantId: string,
    { config, tokenId, model, name, instructions, description, metadata }: AssistantUpdateParams
  ): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, assistantId, this.ain);

    // NOTE(jiyoung): mocked assistant for test.
    const assistant = {
      id: assistantId,
      ...{ model: model || 'gpt-3.5-turbo' },
      ...{ name: name || 'name' },
      ...{ instructions: instructions || 'instructions' },
      ...{ description: description || null },
      ...{ metadata: metadata || {} },
      created_at: 0,
    };

    // TODO(jiyoung): use ainize.request() function after deployment.
    // const ai = await validateAndGetAiService(aiName, this.ainize);
    // const response = await ai.request(<REQUEST_DATA>);

    const txBody = this.buildTxBodyForUpdateAssistant(assistant, appId, tokenId, aiName, address);

    // TODO(jiyoung): implement failure handling logic.
    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, assistant };
  }

  async delete(
    assistantId: string,
    { config, tokenId }: AssistantDeleteParams
  ): Promise<AssistantDeleteTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(config.provider, config.api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, assistantId, this.ain);

    // NOTE(jiyoung): mocked deleted assistant for test.
    const delAssistant = { id: assistantId, deleted: true };

    // TODO(jiyoung): use ainize.request() function after deployment.
    // const ai = await validateAndGetAiService(aiName, this.ainize);
    // const response = await ai.request(<REQUEST_DATA>);

    const txBody = this.buildTxBodyForDeleteAssistant(appId, tokenId, aiName, address);

    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, delAssistant };
  }

  async get(
    assistantId: string,
    objectId: string,
    provider: string,
    api: string,
    tokenId: string
  ): Promise<Assistant> {
    const appId = Ainft721Object.getAppId(objectId);

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const aiName = validateAndGetAiName(provider, api);
    await validateAiConfig(appId, aiName, this.ain);
    await validateTokenAi(appId, tokenId, aiName, assistantId, this.ain);

    // NOTE(jiyoung): mocked assistant for test.
    const assistant = {
      id: assistantId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key: 'value' },
      created_at: 0,
    };

    // TODO(jiyoung): use ainize.request() function after deployment.
    // const ai = await validateAndGetAiService(aiName, this.ainize);
    // const response = await ai.request(<REQUEST_DATA>);

    return assistant;
  }

  private buildTxBodyForCreateAssistant(
    assistant: Assistant,
    appId: string,
    tokenId: string,
    aiName: string,
    address: string
  ) {
    const ref = Ref.app(appId).token(tokenId).ai(aiName).root();
    const value = {
      id: assistant.id,
      object: 'assistant',
      config: {
        model: assistant.model,
        name: assistant.name,
        instructions: assistant.instructions,
        ...(assistant.description && { description: assistant.description }),
        ...(assistant.metadata &&
          !(Object.keys(assistant.metadata).length === 0) && {
            metadata: assistant.metadata,
          }),
      },
    };
    const setValueOp = buildSetValueOp(ref, value);
    return buildSetTransactionBody(setValueOp, address);
  }

  private buildTxBodyForUpdateAssistant(
    assistant: Assistant,
    appId: string,
    tokenId: string,
    aiName: string,
    address: string
  ) {
    const ref = Ref.app(appId).token(tokenId).ai(aiName).config();
    const value = {
      model: assistant.model,
      name: assistant.name,
      instructions: assistant.instructions,
      ...(assistant.description && { description: assistant.description }),
      ...(assistant.metadata &&
        !(Object.keys(assistant.metadata).length === 0) && {
          metadata: assistant.metadata,
        }),
    };
    const setValueOp = buildSetValueOp(ref, value);
    return buildSetTransactionBody(setValueOp, address);
  }

  private buildTxBodyForDeleteAssistant(
    appId: string,
    tokenId: string,
    aiName: string,
    address: string
  ) {
    const ref = Ref.app(appId).token(tokenId).ai(aiName).root();
    const setValueOp = buildSetValueOp(ref, null);
    return buildSetTransactionBody(setValueOp, address);
  }
}
