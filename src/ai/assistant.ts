import _ from 'lodash';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getServerName, requestWithAuth } from '../ainize';
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleteTransactionResult,
  AssistantDeleted,
  AssistantMinted,
  AssistantTransactionResult,
  AssistantUpdateParams,
  NftToken,
  NftTokens,
  QueryParams,
} from '../types';
import {
  MESSAGE_GC_MAX_SIBLINGS,
  MESSAGE_GC_NUM_SIBLINGS_DELETED,
  THREAD_GC_MAX_SIBLINGS,
  THREAD_GC_NUM_SIBLINGS_DELETED,
} from '../constants';
import {
  buildSetTxBody,
  buildSetValueOp,
  sendTx,
  buildSetWriteRuleOp,
  buildSetOp,
  buildSetStateRuleOp,
  getChecksumAddress,
} from '../utils/util';
import {
  isObjectOwner,
  validateAssistant,
  validateDuplicateAssistant,
  validateObject,
  validateServerConfigurationForObject,
  validateToken,
} from '../utils/validator';
import { Path } from '../utils/path';

/**
 * This class supports building assistants that enables conversation with LLM models.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Assistants extends FactoryBase {
  /**
   * Create an assistant with a model and instructions.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {AssistantCreateParams} AssistantCreateParams - The parameters to create assistant.
   * @returns Returns a promise that resolves with both the transaction result and the created assistant.
   */
  async create(
    objectId: string,
    tokenId: string,
    { model, name, instructions, description, metadata }: AssistantCreateParams
  ): Promise<AssistantTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    const isAdmin = await isObjectOwner(this.ain, objectId, address);
    await validateToken(this.ain, objectId, tokenId);
    await validateDuplicateAssistant(this.ain, objectId, tokenId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.CREATE_ASSISTANT;
    const body = {
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await requestWithAuth<Assistant>(this.ainize!, this.ain, {
      serverName,
      opType,
      data: body,
    });

    if (!isAdmin) {
      return { assistant: data };
    }

    const txBody = this.buildTxBodyForCreateAssistant(address, objectId, tokenId, data);
    const result = await sendTx(this.ain, txBody);

    return { ...result, assistant: data };
  }

  /**
   * Updates an assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} assistantId - The ID of assistant.
   * @param {AssistantUpdateParams} AssistantUpdateParams - The parameters to update assistant.
   * @returns Returns a promise that resolves with both the transaction result and the updated assistant.
   */
  async update(
    objectId: string,
    tokenId: string,
    assistantId: string,
    { model, name, instructions, description, metadata }: AssistantUpdateParams
  ): Promise<AssistantTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    const isAdmin = await isObjectOwner(this.ain, objectId, address);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId, assistantId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.MODIFY_ASSISTANT;
    const body = {
      assistantId,
      ...(model && { model }),
      ...(name && { name }),
      ...(instructions && { instructions }),
      ...(description && { description }),
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await requestWithAuth<Assistant>(this.ainize!, this.ain, {
      serverName,
      opType,
      data: body,
    });

    if (!isAdmin) {
      return { assistant: data };
    }

    const txBody = this.buildTxBodyForUpdateAssistant(address, objectId, tokenId, data);
    const result = await sendTx(this.ain, txBody);

    return { ...result, assistant: data };
  }

  /**
   * Deletes an assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} assistantId - The ID of assistant.
   * @returns Returns a promise that resolves with both the transaction result and the deleted assistant.
   */
  async delete(
    objectId: string,
    tokenId: string,
    assistantId: string
  ): Promise<AssistantDeleteTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    const isAdmin = await isObjectOwner(this.ain, objectId, address);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId, assistantId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.DELETE_ASSISTANT;
    const body = { assistantId };
    const { data } = await requestWithAuth<AssistantDeleted>(this.ainize!, this.ain, {
      serverName,
      opType,
      data: body,
    });

    if (!isAdmin) {
      return { delAssistant: data };
    }

    const txBody = this.buildTxBodyForDeleteAssistant(address, objectId, tokenId);
    const result = await sendTx(this.ain, txBody);

    return { ...result, delAssistant: data };
  }

  /**
   * Retrieves an assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} assistantId - The ID of assistant.
   * @returns Returns a promise that resolves with the assistant.
   */
  async get(objectId: string, tokenId: string, assistantId: string): Promise<Assistant> {
    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId, assistantId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.RETRIEVE_ASSISTANT;
    const body = { assistantId };
    const { data } = await requestWithAuth<Assistant>(this.ainize!, this.ain, {
      serverName,
      opType,
      data: body,
    });

    return data;
  }

  async list(objectId: string, { limit = 20, offset = 0, order = 'desc' }: QueryParams) {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);

    const tokens = await this.getTokensByAddress(objectId, address);
    const assistants = this.getAssistantsFromTokens(tokens);
    const sorted = this.sortAssistants(assistants, order);

    const total = sorted.length;
    const items = sorted.slice(offset, offset + limit);

    return { total, items };
    // NOTE(jiyoung): example data
    /*
    return {
      total: 2,
      items: [
        {
          id: 'asst_CswXI1p9YGKr32Ks2ENPb5VL',
          model: 'gpt-4',
          name: 'AINA-EBAJYJF111',
          instructions: '',
          description: 'OpenAI의 가장 강력한 모델입니다.',
          metadata: {
            image: 'https://picsum.photos/id/2/200/200',
          },
          created_at: 1711969423,
        },
        {
          id: 'asst_IfWuJqqO5PdCF9DbgZRcFClG',
          model: 'gpt-3.5-turbo',
          name: 'AINA-TKAJYJF1C5',
          instructions: '',
          description: '일상적인 작업에 적합합니다. GPT-3.5-turbo에 의해 구동됩니다.',
          metadata: {
            image: 'https://picsum.photos/id/1/200/200',
          },
          created_at: 1704034800,
        },
      ],
    };
    */
  }

  async mintAndCreate(
    objectId: string,
    to: string,
    { model, name, instructions, description, metadata }: AssistantCreateParams
  ): Promise<AssistantMinted> {
    const checksum = getChecksumAddress(to);

    await validateObject(this.ain, objectId);

    const serverName = getServerName();
    await validateServerConfigurationForObject(this.ain, objectId, serverName);

    const opType = OperationType.MINT_CREATE_ASSISTANT;
    const body = {
      objectId,
      to: checksum,
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await requestWithAuth<AssistantMinted>(this.ainize!, this.ain, {
      serverName,
      opType,
      data: body,
    });

    return data;
    // NOTE(jiyoung): example data
    /*
    return {
      tokenId: '1',
      objectId: '0xCE3c4D8dA38c77dEC4ca99cD26B1C4BF116FC401',
      owner: '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0',
      assistant: {
        id: 'asst_IfWuJqqO5PdCF9DbgZRcFClG',
        model: 'gpt-3.5-turbo',
        name: 'AINA-TKAJYJF1C5',
        instructions: '',
        description: '일상적인 작업에 적합합니다. GPT-3.5-turbo에 의해 구동됩니다.',
        metadata: {
          image: 'https://picsum.photos/id/1/200/200',
        },
        created_at: 1704034800,
      },
    };
    */
  }

  private buildTxBodyForCreateAssistant(
    address: string,
    objectId: string,
    tokenId: string,
    { id, model, name, instructions, description, metadata, created_at }: Assistant
  ) {
    const appId = AinftObject.getAppId(objectId);
    const assistantPath = Path.app(appId).token(tokenId).ai().value();
    const historyPath = `/apps/${appId}/tokens/${tokenId}/ai/history/$user_addr`;
    const threadPath = `${historyPath}/threads/$thread_id`;
    const messagePath = `${threadPath}/messages/$message_id`;

    const config = {
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };
    const info = {
      id,
      type: 'chat',
      config,
      createdAt: created_at,
      history: true,
    };

    const rules = {
      write: `auth.addr === $user_addr || util.isAppAdmin('${appId}', auth.addr, getValue) === true`,
      state: {
        thread: {
          gc_max_siblings: THREAD_GC_MAX_SIBLINGS,
          gc_num_siblings_deleted: THREAD_GC_NUM_SIBLINGS_DELETED,
        },
        message: {
          gc_max_siblings: MESSAGE_GC_MAX_SIBLINGS,
          gc_num_siblings_deleted: MESSAGE_GC_NUM_SIBLINGS_DELETED,
        },
      },
    };

    const setAssistantInfoOp = buildSetValueOp(assistantPath, info);
    const setHistoryWriteRuleOp = buildSetWriteRuleOp(historyPath, rules.write);
    const setThreadGCRuleOp = buildSetStateRuleOp(threadPath, rules.state.thread);
    const setMessageGCRuleOp = buildSetStateRuleOp(messagePath, rules.state.message);

    return buildSetTxBody(
      buildSetOp([
        setAssistantInfoOp,
        setHistoryWriteRuleOp,
        setThreadGCRuleOp,
        setMessageGCRuleOp,
      ]),
      address
    );
  }

  private buildTxBodyForUpdateAssistant(
    address: string,
    objectId: string,
    tokenId: string,
    { model, name, instructions, description, metadata }: Assistant
  ) {
    const appId = AinftObject.getAppId(objectId);
    const assistantConfigPath = Path.app(appId).token(tokenId).ai().config().value();

    const config = {
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    return buildSetTxBody(buildSetValueOp(assistantConfigPath, config), address);
  }

  private buildTxBodyForDeleteAssistant(address: string, objectId: string, tokenId: string) {
    const appId = AinftObject.getAppId(objectId);
    const assistantPath = Path.app(appId).token(tokenId).ai().value();
    const historyPath = `/apps/${appId}/tokens/${tokenId}/ai/history/$user_addr`;
    const threadPath = `${historyPath}/threads/$thread_id`;
    const messagePath = `${threadPath}/messages/$message_id`;

    const unsetMessageGCRuleOp = buildSetStateRuleOp(messagePath, null);
    const unsetThreadGCRuleOp = buildSetStateRuleOp(threadPath, null);
    const unsetHistoryWriteRuleOp = buildSetWriteRuleOp(historyPath, null);
    const unsetAssistantInfoOp = buildSetValueOp(assistantPath, null);

    return buildSetTxBody(
      buildSetOp([
        unsetMessageGCRuleOp,
        unsetThreadGCRuleOp,
        unsetHistoryWriteRuleOp,
        unsetAssistantInfoOp,
      ]),
      address
    );
  }

  private async getTokensByAddress(objectId: string, address: string) {
    const appId = AinftObject.getAppId(objectId);
    const tokensPath = Path.app(appId).tokens().value();
    const tokens: NftTokens = await this.ain.db.ref(tokensPath).getValue() || {};
    return Object.values(tokens).filter((token) => token.owner === address);
  }

  private getAssistantsFromTokens(tokens: NftToken[]) {
    return tokens.reduce<Assistant[]>((acc, token) => {
      if (token.ai) {
        acc.push(this.toAssistant(token.ai));
      }
      return acc;
    }, []);
  }

  private toAssistant(data: any): Assistant {
    return {
      id: data.id,
      model: data.config.model,
      name: data.config.name,
      instructions: data.config.instructions,
      description: data.config.description || null,
      metadata: data.config.metadata || {},
      created_at: data.createdAt,
    };
  }

  private sortAssistants(assistants: Assistant[], order: 'asc' | 'desc') {
    return assistants.sort((a, b) => {
      if (a.created_at < b.created_at) return order === 'asc' ? -1 : 1;
      if (a.created_at > b.created_at) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
