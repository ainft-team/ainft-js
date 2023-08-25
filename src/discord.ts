import {
  TaskIdListByEventId,
  EventInfo,
  ChannelPersonaModelInfo,
  ServerPersonaModelInfo,
  HttpMethod,
  InviteInfo,
} from "./types";
import FactoryBase from "./factoryBase";

export default class Discord extends FactoryBase {
  /**
   * Connect discord server and AINFT Factory app. A Discord server can only connect to one app.
   * @param {string} appId
   * @param {string} discordServerId
   * @returns
   */
  connectDiscordWithApp(appId: string, discordServerId: string): Promise<void> {
    const body = { appId, discordServerId };
    const trailingUrl = 'register';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Get the appId connected with the Discord server.
   * @param {string} discordServerId
   * @param {string} appId
   * @returns
   */
  getConnectedApp(
    discordServerId: string,
    appId: string = ''
  ): Promise<string | null> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/app`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get event list connected with the Discord server
   * @param {string} appId 
   * @param {string} discordServerId 
   * @returns 
   */
  getConnectedEventsByServer(
    appId: string,
    discordServerId: string
  ): Promise<(EventInfo | null)[]> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/events`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get tasks connected with discord channel
   * @param {string} appId 
   * @param {string} discordServerId 
   * @param {string} discordChannelId 
   * @returns 
   */
  getConnectedTasksByChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<TaskIdListByEventId> {
    const query = { appId };
    const trailingUrl = `${discordServerId}/${discordChannelId}/tasks`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Add persona model to discord channel.
   * @param {string} appId 
   * @param {string} modelId 
   * @param {string} modelName 
   * @param {string} discordServerId 
   * @param {string} discordChannelId 
   * @returns 
   */
  addPersonaModelToDiscordChannel(
    appId: string,
    modelId: string,
    modelName: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<void> {
    const body = {
      appId,
      modelId,
      modelName,
      discordServerId,
      discordChannelId,
    };
    const trailingUrl = `persona-models`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Get persona model connected with discord channel.
   * @param {string} appId 
   * @param {string} discordServerId 
   * @param {string} discordChannelId 
   * @returns 
   */
  getPersonaModelForDiscordChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<ChannelPersonaModelInfo | null> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordServerId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get persona models connected with discord server.
   * @param {string} appId 
   * @param {string} discordServerId 
   * @returns 
   */
  getPersonaModelForDiscordServer(
    appId: string,
    discordServerId: string
  ): Promise<ServerPersonaModelInfo | null> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordServerId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Disconnect persona model with discord channel.
   * @param {string} appId 
   * @param {string} discordServerId 
   * @param {string} discordChannelId 
   * @returns 
   */
  deletePersonaModelFromDiscordChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<void> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordServerId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * You can add new user's invitation information.
   * @param {string} appId
   * @param {string} eventId
   * @param {string} taskInstanceId
   * @param {string} inviteeId
   * @param {string} inviterId If you can't identify the inviter, leave blank this.
   * @param {Array<string>} ambiguousInviters Array of userIds invited in a short time.
   * @returns {Promise<InviteInfo>} Return InviteInfo object.
   */
  addInviteInfo(
    appId: string,
    eventId: string,
    taskInstanceId: string,
    inviteeId: string,
    inviterId?: string,
    ambiguousInviters?: Array<string>
  ): Promise<void> {
    const body = {
      appId,
      eventId,
      taskInstanceId,
      data: {
        inviteeId,
        inviterId,
        ambiguousInviters,
      },
    };
    const trailingUrl = `invite-info`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * You can get user's invitation information.
   * @param {string} appId
   * @param {string} discordServerId
   * @param {string} inviteeId
   * @returns {Promise<InviteInfo>} Return InviteInfo object.
   */
  getInviteInfo(
    appId: string,
    discordServerId: string,
    inviteeId: string
  ): Promise<InviteInfo> {
    const query = { appId };
    const trailingUrl = `invite-info/${discordServerId}/${inviteeId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
