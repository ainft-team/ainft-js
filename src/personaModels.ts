import AinftBase from './ainftBase';
import { HttpMethod, CreatePersonaModelInfo, ChatResponse, PersonaModelCreditInfo } from './types';

export default class PersonaModels extends AinftBase {
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

  chat(
    modelId: string,
    appId: string,
    userId: string,
    message: string,
    messageId?: string,
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

  getCreditInfo(
    appId: string,
    modelId: string,
  ): Promise<PersonaModelCreditInfo | null> {
    const query = { appId };
    const trailingUrl = `${modelId}/credit`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
