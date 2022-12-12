import AinftBase from './ainftBase';
import { HttpMethod, CreatePersonaModelInfo, ChatResponse } from './types';

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
}
