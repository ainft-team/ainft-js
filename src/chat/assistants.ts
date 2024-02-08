import Ainft721Object from '../ainft721Object';
import BlockchainBase from '../blockchainBase';
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleteTransactionResult,
  AssistantDeleted,
  AssistantTransactionResult,
  AssistantUpdateParams,
  JobType,
  ServiceProvider,
} from '../types';
import {
  buildSetTransactionBody,
  buildSetValueOp,
  isTransactionSuccess,
  Ref,
  validateAndGetServiceName,
  validateAndGetService,
  validateAssistant,
  validateObject,
  validateObjectOwner,
  validateObjectServiceConfig,
  validateToken,
  sendRequestToService,
  sendTransaction,
} from '../util';

/**
 * This class supports building assistants that enables conversation with LLM models.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class Assistants extends BlockchainBase {
  /**
   * Create an assistant with a model and instructions.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @param {AssistantCreateParams} AssistantCreateParams - The parameters to create assistant.
   * @returns Returns a promise that resolves with both the transaction result and the created assistant.
   */
  async create(
    objectId: string,
    tokenId: string,
    provider: ServiceProvider,
    { model, name, instructions, description, metadata }: AssistantCreateParams
  ): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.CREATE_ASSISTANT;
    const body = {
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && { metadata }),
    };

    const assistant = await sendRequestToService<Assistant>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    const txBody = this.buildTxBodyForCreateAssistant(
      assistant,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await sendTransaction(txBody, this.ain);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, assistant };
  }

  /**
   * Updates an assistant.
   * @param {string} assistantId - The ID of assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @param {AssistantUpdateParams} AssistantUpdateParams - The parameters to update assistant.
   * @returns Returns a promise that resolves with both the transaction result and the updated assistant.
   */
  async update(
    assistantId: string,
    objectId: string,
    tokenId: string,
    provider: ServiceProvider,
    { model, name, instructions, description, metadata }: AssistantUpdateParams
  ): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwner(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateAndGetServiceName(provider);
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, assistantId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.MODIFY_ASSISTANT;
    const body = {
      assistantId,
      ...(model && { model }),
      ...(name && { name }),
      ...(instructions && { instructions }),
      ...(description && { description }),
      ...(metadata && { metadata }),
    };

    const assistant = await sendRequestToService<Assistant>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    const txBody = this.buildTxBodyForUpdateAssistant(
      assistant,
      appId,
      tokenId,
      serviceName,
      address
    );
    const result = await sendTransaction(txBody, this.ain);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, assistant };
  }

  /**
   * Deletes an assistant.
   * @param {string} assistantId - The ID of assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @returns Returns a promise that resolves with both the transaction result and the deleted assistant.
   */
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
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, assistantId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.DELETE_ASSISTANT;
    const body = { assistantId };

    const delAssistant = await sendRequestToService<AssistantDeleted>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    const txBody = this.buildTxBodyForDeleteAssistant(appId, tokenId, serviceName, address);
    const result = await sendTransaction(txBody, this.ain);

    if (!isTransactionSuccess(result)) {
      throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
    }

    return { ...result, delAssistant };
  }

  /**
   * Retrieves an assistant.
   * @param {string} assistantId - The ID of assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {ServiceProvider} provider - The service provider to use.
   * @returns Returns a promise that resolves with the assistant.
   */
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
    await validateObjectServiceConfig(appId, serviceName, this.ain);
    await validateAssistant(appId, tokenId, serviceName, assistantId, this.ain);

    const service = await validateAndGetService(serviceName, this.ainize);

    const jobType = JobType.RETRIEVE_ASSISTANT;
    const body = { assistantId };

    const assistant = await sendRequestToService<Assistant>(
      jobType,
      body,
      service,
      this.ain,
      this.ainize
    );

    return assistant;
  }

  private buildTxBodyForCreateAssistant(
    assistant: Assistant,
    appId: string,
    tokenId: string,
    serviceName: string,
    address: string
  ) {
    const { id, model, name, instructions, description, metadata } = assistant;
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).root();

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
    const { model, name, instructions, description, metadata } = assistant;
    const ref = Ref.app(appId).token(tokenId).ai(serviceName).config();

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