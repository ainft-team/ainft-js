import FactoryBase from './factoryBase';
import { HttpMethod, CreatePersonaModelInfo, ChatResponse, PersonaModelCreditInfo } from './types';
import { authenticated } from './utils/decorator';

/**
 * This class supports creating persona models and managing it.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class PersonaModels extends FactoryBase {
  /**
   * Creates persona model.
   * @param appId The ID of app.
   * @param userId The ID of user who create persona model.
   * @param modelName The name of persona model.
   * @param coreBeliefs - This is the central content of the persona model. The model reflects this with the highest priority.
   * @returns Returns the information of the persona model created.
   */
  @authenticated
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
   * Chats with your persona model.
   * @param modelId The ID of persona model.
   * @param appId The ID of app.
   * @param userId The ID of user who want to chat with persona model.
   * @param message The message the user wants to send.
   * @param messageId (Optional) The ID of message. If you want to manage the message ID separately, set it up.
   * @returns Returns response of persona model.
   */
  @authenticated
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
   * Gets credit info with connected persona model.
   * @param appId The ID of app.
   * @param modelId The ID of persona model.
   * @returns If set, returns credit and burn amount information.
   */
  @authenticated
  getCreditInfo(
    appId: string,
    modelId: string
  ): Promise<PersonaModelCreditInfo | null> {
    const query = { appId };
    const trailingUrl = `${modelId}/credit`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
