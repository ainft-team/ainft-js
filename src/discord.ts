import {
  TaskIdListByEventId,
  EventInfo,
  PersonaModelForDiscordChannelInfo,
  HttpMethod,
  InviteInfo,
} from "./types";
import AinftBase from "./ainftBase";

export default class Discord extends AinftBase {
  connectDiscordWithApp(appId: string, discordServerId: string): Promise<void> {
    const body = { appId, discordServerId };
    const trailingUrl = "register";
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getConnectedApp(
    discordServerId: string,
    appId: string = ""
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
    const trailingUrl = `persona-models`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getPersonaModelForDiscordChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<PersonaModelForDiscordChannelInfo> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordServerId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  deletePersonaModelFromDiscordChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<void> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordServerId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  addInviteInfo(
    appId: string,
    eventId: string,
    taskInstanceId: string,
    inviteCode: string,
    inviteeId: string,
    inviterId?: string,
  ): Promise<void> {
    const body = {
      appId,
      eventId,
      taskInstanceId,
      inviteCode,
      inviteeId,
      inviterId,
    };
    const trailingUrl = `invite-info`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getInviteInfo(
    appId: string,
    discordServerId: string,
    inviteeId: string,
  ): Promise<InviteInfo> {
    const query = { appId };
    const trailingUrl = `invite-info/${discordServerId}/${inviteeId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
