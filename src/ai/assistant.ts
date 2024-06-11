import _ from 'lodash';

import FactoryBase from '../factoryBase';
import AinftObject from '../ainft721Object';
import { OperationType, getServiceName, request } from '../ainize';
import {
  Assistant,
  AssistantCreateOptions,
  AssistantCreateParams,
  AssistantDeleteTransactionResult,
  AssistantDeleted,
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
  WHITELISTED_OBJECT_IDS,
} from '../constants';
import { getEnv } from '../utils/env';
import { Path } from '../utils/path';
import {
  buildSetValueOp,
  buildSetWriteRuleOp,
  buildSetStateRuleOp,
  buildSetOp,
  buildSetTxBody,
  sendTx,
} from '../utils/transaction';
import { getChecksumAddress, getAssistant, getToken } from '../utils/util';
import {
  isObjectOwner,
  validateAssistant,
  validateDuplicateAssistant,
  validateObject,
  validateServerConfigurationForObject,
  validateToken,
} from '../utils/validator';

enum Role {
  OWNER = 'owner',
  USER = 'user',
}

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
   * @param {AssistantCreateOptions} AssistantCreateOptions - The creation options.
   * @returns Returns a promise that resolves with both the transaction result and the created assistant.
   */
  async create(
    objectId: string,
    tokenId: string,
    { model, name, instructions, description, metadata }: AssistantCreateParams,
    options: AssistantCreateOptions = {}
  ): Promise<AssistantTransactionResult> {
    const address = await this.ain.signer.getAddress();

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateDuplicateAssistant(this.ain, objectId, tokenId);

    // NOTE(jiyoung): creation is limited to owners, except for whitelisted objects.
    const role = (await isObjectOwner(this.ain, objectId, address)) ? Role.OWNER : Role.USER;
    const whitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
    if (!whitelisted && role !== Role.OWNER) {
      throw new Error(`cannot create assistant for the object ${objectId}`);
    }

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.CREATE_ASSISTANT;
    const body = {
      role,
      objectId,
      tokenId,
      model,
      name,
      instructions,
      ...(description && { description }),
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
      ...(options && !_.isEmpty(options) && { options }),
    };

    const { data } = await request<Assistant>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    if (role === Role.OWNER) {
      const txBody = this.buildTxBodyForCreateAssistant(address, objectId, tokenId, data);
      const result = await sendTx(txBody, this.ain);
      return { ...result, assistant: data };
    } else {
      return { assistant: data };
    }
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
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId, assistantId);

    // NOTE(jiyoung): update is limited to owners, except for whitelisted objects.
    const role = (await isObjectOwner(this.ain, objectId, address)) ? Role.OWNER : Role.USER;
    const whitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
    if (!whitelisted && role !== Role.OWNER) {
      throw new Error(`cannot update assistant for the object ${objectId}`);
    }

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.MODIFY_ASSISTANT;
    const body = {
      role,
      objectId,
      tokenId,
      assistantId,
      ...(model && { model }),
      ...(name && { name }),
      ...(instructions && { instructions }),
      ...(description && { description }),
      ...(metadata && !_.isEmpty(metadata) && { metadata }),
    };

    const { data } = await request<Assistant>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    if (role === Role.OWNER) {
      const txBody = this.buildTxBodyForUpdateAssistant(address, objectId, tokenId, data);
      const result = await sendTx(txBody, this.ain);
      return { ...result, assistant: data };
    } else {
      return { assistant: data };
    }
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
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId, assistantId);

    // NOTE(jiyoung): deletion is limited to owners, except for whitelisted objects.
    const role = (await isObjectOwner(this.ain, objectId, address)) ? Role.OWNER : Role.USER;
    const whitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
    if (!whitelisted && role !== Role.OWNER) {
      throw new Error(`cannot delete assistant for the object ${objectId}`);
    }

    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.DELETE_ASSISTANT;
    const body = { role, objectId, tokenId, assistantId };
    const { data } = await request<AssistantDeleted>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    if (role === Role.OWNER) {
      const txBody = this.buildTxBodyForDeleteAssistant(address, objectId, tokenId);
      const result = await sendTx(txBody, this.ain);
      return { ...result, delAssistant: data };
    } else {
      return { delAssistant: data };
    }
  }

  /**
   * Retrieves an assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} assistantId - The ID of assistant.
   * @returns Returns a promise that resolves with the assistant.
   */
  async get(objectId: string, tokenId: string, assistantId: string): Promise<Assistant> {
    const appId = AinftObject.getAppId(objectId);

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);

    const assistant = await getAssistant(this.ain, appId, tokenId);
    const token = await getToken(this.ain, appId, tokenId);

    const data = {
      id: assistant.id,
      tokenId,
      owner: token.owner,
      model: assistant.config.model,
      name: assistant.config.name,
      instructions: assistant.config.instructions,
      description: assistant.config.description || null,
      metadata: assistant.config.metadata || {},
      created_at: assistant.createdAt,
    };

    return data;
  }

  /**
   * Retrieves a list of assistants.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} address - The checksum address of account.
   * @param {QueryParams} QueryParams - The parameters for querying items.
   * @returns Returns a promise that resolves with the list of assistants.
   */
  async list(
    objectId: string,
    address: string,
    { limit = 20, offset = 0, order = 'desc' }: QueryParams = {}
  ) {
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
          tokenId: '1',
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
          tokenId: '2',
        },
      ],
    };
    */
  }

  async mint(objectId: string, to: string) {
    const checksum = getChecksumAddress(to);
    const whitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
    if (!whitelisted) {
      throw new Error(
        `cannot request mint for the object '${objectId}'.\n` +
          `if you're the owner, please use the Ainft721Object.mint() function.`
      );
    }

    const serviceName = getServiceName();
    const opType = OperationType.MINT_TOKEN;
    const body = { objectId, to: checksum };
    const { data } = await request<any>(this.ainize!, {
      serviceName,
      opType,
      data: body,
      timeout: 2 * 60 * 1000, // 2min
    });

    return data;
    // NOTE(jiyoung): example data
    /*
    return {
      tx_hash: '0x3ffc4aa5f557bddf4b53b90dfe97e368dd6d4d6473cff0b948029e24b2e09868',
      tokenId: '1',
      objectId: '0xCE3c4D8dA38c77dEC4ca99cD26B1C4BF116FC401',
    };
    */
  }

  // TODO(jiyoung): implement `mintAndCreate` method.
  // async mintAndCreate(
  //   objectId: string,
  //   to: string,
  //   { model, name, instructions, description, metadata }: AssistantCreateParams
  // ): Promise<AssistantMinted> {
  //   const checksum = getChecksumAddress(to);
  //   const whitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
  //   if (!whitelisted) {
  //     throw new Error(
  //       `cannot request mint for the object '${objectId}'.\n` +
  //         `if you're the owner, please use the Ainft721Object.mint() function.`
  //     );
  //   }

  //   const serviceName = getServiceName();
  //   const opType = OperationType.MINT_CREATE_ASSISTANT;
  //   const body = {
  //     objectId,
  //     to: checksum,
  //     model,
  //     name,
  //     instructions,
  //     ...(description && { description }),
  //     ...(metadata && !_.isEmpty(metadata) && { metadata }),
  //   };

  //   const { data } = await request<AssistantMinted>(this.ainize!, {
  //     serviceName,
  //     opType,
  //     data: body,
  //   });

  //   return data;
  //   // NOTE(jiyoung): example data
  //   /*
  //   return {
  //     tokenId: '1',
  //     objectId: '0xCE3c4D8dA38c77dEC4ca99cD26B1C4BF116FC401',
  //     owner: '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0',
  //     assistant: {
  //       id: 'asst_IfWuJqqO5PdCF9DbgZRcFClG',
  //       model: 'gpt-3.5-turbo',
  //       name: 'AINA-TKAJYJF1C5',
  //       instructions: '',
  //       description: '일상적인 작업에 적합합니다. GPT-3.5-turbo에 의해 구동됩니다.',
  //       metadata: {
  //         image: 'https://picsum.photos/id/1/200/200',
  //       },
  //       created_at: 1704034800,
  //     },
  //   };
  //   */
  // }

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
    const tokens: NftTokens = (await this.ain.db.ref(tokensPath).getValue()) || {};
    return Object.entries(tokens).reduce<NftToken[]>((acc, [id, token]) => {
      if (token.owner === address) {
        acc.push({ tokenId: id, ...token });
      }
      return acc;
    }, []);
  }

  private getAssistantsFromTokens(tokens: NftToken[]) {
    return tokens.reduce<Assistant[]>((acc, token) => {
      if (token.ai) {
        acc.push(this.toAssistant(token));
      }
      return acc;
    }, []);
  }

  private toAssistant(data: any): Assistant {
    return {
      id: data.ai.id,
      tokenId: data.tokenId,
      owner: data.owner,
      model: data.ai.config.model,
      name: data.ai.config.name,
      instructions: data.ai.config.instructions,
      description: data.ai.config.description || null,
      metadata: data.ai.config.metadata || {},
      created_at: data.ai.createdAt,
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
