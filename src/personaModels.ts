import AinftBase from './ainftBase';
import { HttpMethod, CreatePersonaModelInfo, ChatResponse, PersonaModelCreditInfo } from './types';

export default class PersonaModels extends AinftBase {
  /**
   * Create persona model.
   * @param appId
   * @param userId
   * @param modelName
   * @param coreBeliefs - This is the central content of the persona model. The model reflects this with the highest priority.
   * @returns
   */
  create(
    appId: string,
    userId: string,
    modelName: string,
    coreBeliefs: string
  ): Promise<CreatePersonaModelInfo> {
    const body = {
      appId,
      userId,
      modelName,
      coreBeliefs,
    };
    const trailingUrl = '';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Chat with your persona model.
   * @param modelId 
   * @param appId 
   * @param userId 
   * @param message 
   * @param messageId 
   * @returns 
   */
  chat(
    modelId: string,
    appId: string,
    userId: string,
    message: string,
    messageId?: string
  ): Promise<ChatResponse> {
    const body = {
      modelId,
      appId,
      userId,
      message,
      messageId,
    };
    const trailingUrl = 'chat';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Get credit info with connected persona model.
   * @param appId 
   * @param modelId 
   * @returns 
   */
  getCreditInfo(
    appId: string,
    modelId: string
  ): Promise<PersonaModelCreditInfo | null> {
    const query = { appId };
    const trailingUrl = `${modelId}/credit`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
