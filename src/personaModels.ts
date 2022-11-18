import AinftBase from './ainftBase';
import { HttpMethod, CreatePersonaModelInfo } from './types';

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
}
