import { TaskIdListByEventId, EventInfo, HttpMethod } from './types';
import AinftBase from './ainftBase';

export default class Discord extends AinftBase {

  connectDiscordWithApp(appId: string, discordServerId: string): Promise<void> {
    const body = { appId, discordServerId };
    const trailingUrl = 'register';
    return this.sendRequest(HttpMethod.POST, body, trailingUrl);
  }

  getConnectedApp(
    discordServerId: string,
    appId: string = ''
  ): Promise<string | null> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/app`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }

  getConnectedEventsByServer(
    appId: string,
    discordServerId: string
  ): Promise<(EventInfo | null)[]> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/events`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }

  getConnectedTasksByChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<TaskIdListByEventId> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/${discordChannelId}/tasks`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }
}
