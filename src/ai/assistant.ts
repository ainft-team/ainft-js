import _ from "lodash";

import FactoryBase from "../factoryBase";
import AinftObject from "../ainft721Object";
import { OperationType, getServiceName, request } from "../utils/ainize";
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleteTransactionResult,
  AssistantDeleted,
  AssistantTransactionResult,
  AssistantUpdateParams,
  NftToken,
  NftTokens,
  QueryParamsWithoutSort,
} from "../types";
import {
  MESSAGE_GC_MAX_SIBLINGS,
  MESSAGE_GC_NUM_SIBLINGS_DELETED,
  THREAD_GC_MAX_SIBLINGS,
  THREAD_GC_NUM_SIBLINGS_DELETED,
  WHITELISTED_OBJECT_IDS,
} from "../constants";
import { getEnv } from "../utils/env";
import { Path } from "../utils/path";
import {
  buildSetValueOp,
  buildSetWriteRuleOp,
  buildSetStateRuleOp,
  buildSetOp,
  buildSetTxBody,
  sendTx,
} from "../utils/transaction";
import { getChecksumAddress, getAssistant, getToken, arrayToObject } from "../utils/util";
import {
  isObjectOwner,
  validateAssistant,
  validateDuplicateAssistant,
  validateObject,
  validateServerConfigurationForObject,
  validateToken,
} from "../utils/validator";
import { authenticated } from "../utils/decorator";
import { AinftError } from "../error";

enum Role {
  OWNER = "owner",
  USER = "user",
}

/**
 * This class supports building assistants that enables conversation with LLM models.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export class Assistants extends FactoryBase {
  /**
   * Create an assistant with a model and instructions.
   * @param {string} objectId - The ID of the AINFT object.
   * @param {string} tokenId - The ID of the AINFT token.
   * @param {AssistantCreateParams} AssistantCreateParams - The parameters to create assistant.
   * @returns A promise that resolves with both the transaction result and the created assistant.
   */
  @authenticated
  async create(
    objectId: string,
    tokenId: string,
    params: AssistantCreateParams
  ): Promise<AssistantTransactionResult> {
    const address = await this.ain.signer.getAddress();

    // TODO(jiyoung): check character count for input params.
    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateDuplicateAssistant(this.ain, objectId, tokenId);

    // TODO(jiyoung): fix it.
    // NOTE(jiyoung): creation is limited to owners, except for whitelisted objects.
    const role = (await isObjectOwner(this.ain, objectId, address)) ? Role.OWNER : Role.USER;
    const isWhitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
    if (!isWhitelisted && role !== Role.OWNER) {
      throw new AinftError("permission-denied", `cannot create assistant for ${objectId}`);
    }

    const token = await getToken(this.ain, objectId, tokenId);
    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.CREATE_ASSISTANT;
    const body = this.buildReqBodyForCreateAssistant(objectId, tokenId, role, params);

    const { data } = await request<any>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const assistant: Assistant = {
      id: data.id,
      createdAt: data.createdAt,
      objectId: data.objectId,
      tokenId: data.tokenId,
      tokenOwner: token.owner,
      model: data.model,
      name: data.name,
      description: data.description,
      instructions: data.instructions,
      metadata: {
        author: data.metadata?.author || null,
        bio: data.metadata?.bio || null,
        chatStarter: data.metadata?.chatStarter ? Object.values(data.metadata?.chatStarter) : null,
        greetingMessage: data.metadata?.greetingMessage || null,
        image: data.metadata?.image || null,
        tags: data.metadata?.tags ? Object.values(data.metadata?.tags) : null,
      },
      metrics: data.metrics || {},
    };

    if (role === Role.OWNER) {
      const txBody = this.buildTxBodyForCreateAssistant(data, address);
      const result = await sendTx(txBody, this.ain);
      return { ...result, assistant };
    } else {
      return { assistant };
    }
  }

  /**
   * Updates an assistant.
   * @param {string} objectId - The ID of the AINFT object.
   * @param {string} tokenId - The ID of the AINFT token.
   * @param {string} assistantId - The ID of the assistant.
   * @param {AssistantUpdateParams} AssistantUpdateParams - The parameters to update assistant.
   * @returns A promise that resolves with both the transaction result and the updated assistant.
   */
  @authenticated
  async update(
    objectId: string,
    tokenId: string,
    assistantId: string,
    params: AssistantUpdateParams
  ): Promise<AssistantTransactionResult> {
    const address = await this.ain.signer.getAddress();

    // TODO(jiyoung): limit character count for 'instruction' and 'description'.
    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);
    await validateAssistant(this.ain, objectId, tokenId, assistantId);

    // NOTE(jiyoung): update is limited to owners, except for whitelisted objects.
    const role = (await isObjectOwner(this.ain, objectId, address)) ? Role.OWNER : Role.USER;
    const whitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
    if (!whitelisted && role !== Role.OWNER) {
      throw new AinftError("permission-denied", `cannot update assistant for ${objectId}`);
    }

    const token = await getToken(this.ain, objectId, tokenId);
    const serviceName = getServiceName();
    await validateServerConfigurationForObject(this.ain, objectId, serviceName);

    const opType = OperationType.MODIFY_ASSISTANT;
    const body = this.buildReqBodyForUpdateAssistant(objectId, tokenId, assistantId, role, params);
    const { data } = await request<any>(this.ainize!, {
      serviceName,
      opType,
      data: body,
    });

    const assistant: Assistant = {
      id: data.id,
      createdAt: data.createdAt,
      objectId: data.objectId,
      tokenId: data.tokenId,
      tokenOwner: token.owner,
      model: data.model,
      name: data.name,
      description: data.description,
      instructions: data.instructions,
      metadata: {
        author: data.metadata?.author || null,
        bio: data.metadata?.bio || null,
        chatStarter: data.metadata?.chatStarter ? Object.values(data.metadata?.chatStarter) : null,
        greetingMessage: data.metadata?.greetingMessage || null,
        image: data.metadata?.image || null,
        tags: data.metadata?.tags ? Object.values(data.metadata?.tags) : null,
      },
      metrics: data.metrics || {},
    };

    if (role === Role.OWNER) {
      const txBody = this.buildTxBodyForUpdateAssistant(address, objectId, tokenId, data);
      const result = await sendTx(txBody, this.ain);
      return { ...result, assistant };
    } else {
      return { assistant };
    }
  }

  /**
   * Deletes an assistant.
   * @param {string} objectId - The ID of AINFT object.
   * @param {string} tokenId - The ID of AINFT token.
   * @param {string} assistantId - The ID of assistant.
   * @returns A promise that resolves with both the transaction result and the deleted assistant.
   */
  @authenticated
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
      throw new AinftError("permission-denied", `cannot delete assistant for ${objectId}`);
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
   * @returns A promise that resolves with the assistant.
   */
  async get(objectId: string, tokenId: string, assistantId: string): Promise<Assistant> {
    const appId = AinftObject.getAppId(objectId);

    await validateObject(this.ain, objectId);
    await validateToken(this.ain, objectId, tokenId);

    const _assistant = await getAssistant(this.ain, appId, tokenId);
    const _token = await getToken(this.ain, objectId, tokenId);

    const assistant: Assistant = {
      id: _assistant.id,
      createdAt: _assistant.createdAt,
      objectId,
      tokenId,
      tokenOwner: _token.owner,
      model: _assistant.config.model,
      name: _assistant.config.name,
      description: _assistant.config.description || null,
      instructions: _assistant.config.instructions || null,
      metadata: _assistant.metadata || {},
      metrics: _assistant.metrics || {},
    };

    return assistant;
  }

  /**
   * Retrieves a list of assistants.
   * @param {string[]} objectIds - The ID(s) of AINFT object.
   * @param {string} [address] - (Optional) The checksum address of account.
   * @param {QueryParamsWithoutSort} [queryParamsWithoutSort={}] - The parameters for querying items.
   * @returns A promise that resolves with the list of assistants.
   */
  async list(
    objectIds: string[],
    address?: string | null,
    { limit = 20, offset = 0, order = "desc" }: QueryParamsWithoutSort = {}
  ) {
    await Promise.all(objectIds.map((objectId) => validateObject(this.ain, objectId)));

    const allAssistants = await Promise.all(
      objectIds.map(async (objectId) => {
        return this.getAssistants(objectId, address);
      })
    );
    const assistants = allAssistants.flat();

    const sorted = this.sortAssistants(assistants, order);

    const total = sorted.length;
    const items = sorted.slice(offset, offset + limit);

    return { total, items };
  }

  @authenticated
  async mint(objectId: string, to: string) {
    const checksum = getChecksumAddress(to);
    const whitelisted = WHITELISTED_OBJECT_IDS[getEnv()].includes(objectId);
    if (!whitelisted) {
      throw new AinftError(
        "forbidden",
        `cannot mint token for ${objectId}. please use the Ainft721Object.mint() function instead.`
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
  }

  // NOTE(jiyoung): transform metadata by recursively converting arrays to objects
  // and replacing empty arrays or objects with null.
  private transformMetadata(metadata: any) {
    if (Array.isArray(metadata)) {
      // 1-1. empty array
      if (metadata.length === 0) {
        return null;
      }
      // 1-2. array to object
      const result: { [key: string]: any } = {};
      metadata.forEach((v, i) => {
        result[`${i}`] = this.transformMetadata(v);
      });
      return result;
    } else if (typeof metadata === "object" && metadata !== null) {
      // 2-1. empty object
      if (Object.keys(metadata).length === 0) {
        return null;
      }
      // 2-2. nested object
      const result: { [key: string]: any } = {};
      for (const key in metadata) {
        result[key] = this.transformMetadata(metadata[key]);
      }
      return result;
    }
    return metadata;
  }

  private buildReqBodyForCreateAssistant(
    objectId: string,
    tokenId: string,
    role: Role,
    params: AssistantCreateParams
  ) {
    return {
      role,
      objectId,
      tokenId,
      model: params.model,
      name: params.name,
      description: params.description || null,
      instructions: params.instructions || null,
      metadata: this.transformMetadata(params.metadata),
      options: {
        autoImage: params.autoImage || false,
      },
    };
  }

  private buildTxBodyForCreateAssistant(assistant: Assistant, address: string) {
    const appId = AinftObject.getAppId(assistant.objectId);
    const assistantPath = Path.app(appId).token(assistant.tokenId).ai().value();
    const historyPath = `/apps/${appId}/tokens/${assistant.tokenId}/ai/history/$user_addr`;
    const threadPath = `${historyPath}/threads/$thread_id`;
    const messagePath = `${threadPath}/messages/$message_id`;

    const value = {
      id: assistant.id,
      createdAt: assistant.createdAt,
      config: {
        model: assistant.model,
        name: assistant.name,
        ...(assistant.instructions && { instructions: assistant.instructions }),
        ...(assistant.description && { description: assistant.description }),
        ...(assistant.metadata &&
          !_.isEmpty(assistant.metadata) && { metadata: assistant.metadata }),
      },
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

    const setAssistantInfoOp = buildSetValueOp(assistantPath, value);
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

  private buildReqBodyForUpdateAssistant(
    objectId: string,
    tokenId: string,
    assistantId: string,
    role: Role,
    params: AssistantUpdateParams
  ) {
    return {
      role,
      objectId,
      tokenId,
      assistantId,
      ...(params.model && { model: params.model }),
      ...(params.name && { name: params.name }),
      ...(params.description && { description: params.description }),
      ...(params.instructions && { instructions: params.instructions }),
      metadata: this.transformMetadata(params.metadata),
    };
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

  private async getAssistants(objectId: string, address?: string | null) {
    const appId = AinftObject.getAppId(objectId);
    const tokensPath = Path.app(appId).tokens().value();
    const tokens: NftTokens = (await this.ain.db.ref(tokensPath).getValue()) || {};

    const assistants = await Promise.all(
      Object.entries(tokens).map(async ([id, token]) => {
        if (!address || token.owner === address) {
          if (!token.ai) {
            return null;
          }
          const assistant = await getAssistant(this.ain, appId, id);
          return {
            id: assistant.id,
            createdAt: assistant.createdAt,
            objectId,
            tokenId: id,
            tokenOwner: token.owner,
            model: assistant.config.model,
            name: assistant.config.name,
            description: assistant.config.description || null,
            instructions: assistant.config.instructions || null,
            metadata: assistant.metadata || {},
            metrics: assistant.metrics || {},
          };
        }
        return null;
      })
    );

    return assistants.filter((assistant): assistant is Assistant => assistant !== null);
  }

  private sortAssistants(assistants: Assistant[], order: "asc" | "desc") {
    return assistants.sort((a, b) => {
      if (a.createdAt < b.createdAt) return order === "asc" ? -1 : 1;
      if (a.createdAt > b.createdAt) return order === "asc" ? 1 : -1;
      return 0;
    });
  }
}
