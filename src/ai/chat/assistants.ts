import Ainft721Object from '../../ainft721Object';
import BlockchainBase from '../../blockchainBase';
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleteTransactionResult,
  AssistantTransactionResult,
  AssistantUpdateParams,
  OpenAIJobType,
  ServiceProvider,
} from '../../types';
import {
  ainizeLogin,
  ainizeLogout,
  buildSetTransactionBody,
  buildSetValueOp,
  isTransactionSuccess,
  Ref,
  validateAndGetServiceName,
  validateAndGetService,
  validateAssistant,
  validateObject,
  validateObjectOwner,
  validateServiceConfig,
  validateToken,
} from '../../util';

export default class Assistants extends BlockchainBase {
  async create(
    objectId: string,
    tokenId: string,
    { provider, model, name, instructions, description, metadata }: AssistantCreateParams
  ): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateServiceConfig(appId, serviceName, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const jobType = OpenAIJobType.CREATE_ASSISTANT;
    const body = { jobType, model, name, instructions, description, metadata };
    const assistant = await service.request(body);

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForCreateAssistant(
      assistant,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await this.ain.sendTransaction(txBody);

    if (!isTransactionSuccess(result)) {
      throw Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, assistant };
  }

  async update(
    assistantId: string,
    objectId: string,
    tokenId: string,
    { provider, model, name, instructions, description, metadata }: AssistantUpdateParams
  ): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, assistantId, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const jobType = OpenAIJobType.MODIFY_ASSISTANT;
    const body = {
      jobType,
      assistant_id: assistantId,
      ...(model && { model }),
      ...(name && { name }),
      ...(instructions && { instructions }),
      ...(description && { description }),
      ...(metadata && { metadata }),
    };
    const newAssistant = await service.request(body);

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForUpdateAssistant(
      newAssistant,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await this.ain.sendTransaction(txBody);

    if (!isTransactionSuccess(result)) {
      throw Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, assistant: newAssistant };
  }

  async delete(
    assistantId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider
  ): Promise<AssistantDeleteTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, assistantId, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const jobType = OpenAIJobType.DELETE_ASSISTANT;
    const body = {
      jobType,
      assistant_id: assistantId,
    };
    const delAssistant = await service.request(body);

    await ainizeLogout(this.ainize);

    const txBody = this.buildTxBodyForDeleteAssistant(appId, tokenId, serviceName, address);
    const result = await this.ain.sendTransaction(txBody);

    if (!isTransactionSuccess(result)) {
      throw Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, delAssistant };
  }

  async get(
    assistantId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider
  ): Promise<Assistant> {
    const appId = Ainft721Object.getAppId(objectId);

    await validateObject(appId, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, assistantId, this.ain);
    const service = await validateAndGetService(serviceName, this.ainize);

    await ainizeLogin(this.ain, this.ainize);

    const jobType = OpenAIJobType.RETRIEVE_ASSISTANT;
    const body = {
      jobType,
      assistant_id: assistantId,
    };
    const assistant = await service.request(body);

    await ainizeLogout(this.ainize);

    return assistant;
  }

  private buildTxBodyForCreateAssistant(
    assistant: Assistant,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).root();
    const { id, model, name, instructions, description, metadata } = assistant;

    const config = {
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && Object.keys(metadata).length && { metadata }),
    };
    const value = { id, config, history: true };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }

  private buildTxBodyForUpdateAssistant(
    assistant: Assistant,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).config();
    const { model, name, instructions, description, metadata } = assistant;

    const value = {
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && Object.keys(metadata).length && { metadata }),
    };

    return buildSetTransactionBody(buildSetValueOp(ref, value), address);
  }

  private buildTxBodyForDeleteAssistant(
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).root();

    return buildSetTransactionBody(buildSetValueOp(ref, null), address);
  }
}
