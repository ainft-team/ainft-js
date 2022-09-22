import { TaskIdListByEventId, EventInfo, HttpMethod } from './types';
import AinftBase from './ainftBase';

export default class Discord extends AinftBase {

  async connectDiscordWithApp(appId: string, discordServerId: string) {
    const body = { appId, discordServerId };
    const trailingUrl = 'register';
    await this.sendRequest(HttpMethod.POST, trailingUrl, body);
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
}
