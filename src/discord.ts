import { TaskIdListByEventId, EventInfo, PersonaModelForDiscordChannelInfo, HttpMethod} from './types';
import AinftBase from './ainftBase';

export default class Discord extends AinftBase {
  connectDiscordWithApp(appId: string, discordServerId: string): Promise<void> {
    const body = { appId, discordServerId };
    const trailingUrl = 'register';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getConnectedApp(
    discordServerId: string,
    appId: string = ''
  ): Promise<string | null> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/app`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getConnectedEventsByServer(
    appId: string,
    discordServerId: string
  ): Promise<(EventInfo | null)[]> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/events`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getConnectedTasksByChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<TaskIdListByEventId> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/${discordChannelId}/tasks`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  addPersonaModelToDiscordChannel(
    appId: string,
    modelId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<void> {
    const body = {
      appId,
      modelId,
      discordServerId,
      discordChannelId,
    };
    const trailingUrl = `/persona-models`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getPersonaModelForDiscordChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<PersonaModelForDiscordChannelInfo> {
    const query = { appId };
    const trailingUrl = `/persona-models/${discordServerId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  deletePersonaModelToDiscordChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<void> {
    const query = { appId };
    const trailingUrl = `/persona-models/${discordServerId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }
}
