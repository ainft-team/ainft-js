import AinftBase from "./ainftBase";
import {
  HttpMethod,
} from "./types";

export default class PersonaModels extends AinftBase {
  create(
    appId: string,
    userId: string,
    modelName: string,
    coreBeliefs: string,
    discordServerId?: string,
    discordChannelId?: string,
  ): Promise<string> {
    const body = {
      appId,
      userId,
      modelName,
      coreBeliefs,
      discordServerId,
      discordChannelId,
    };
    const trailingUrl = "";
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
