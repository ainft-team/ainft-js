import {
  TaskIdListByEventId,
  EventInfo,
  ChannelPersonaModelInfo,
  ServerPersonaModelInfo,
  HttpMethod,
  InviteInfo,
} from "./types";
import FactoryBase from "./factoryBase";

/**
 * This class supports the functionality of the AINFT factory for seamless use on Discord.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class Discord extends FactoryBase {
  /**
   * Connects discord server and AINFT Factory app. A Discord server can only connect to one app.
   * @param {string} appId The ID of app.
   * @param {string} discordGuildId The discord guild ID to which app will be linked.
   * @returns
   */
  connectDiscordWithApp(appId: string, discordGuildId: string): Promise<void> {
    const body = { appId, discordServerId: discordGuildId };
    const trailingUrl = 'register';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets the appId connected with the Discord guild.
   * @param {string} discordGuildId The ID of discord guild.
   * @param {string} appId The ID of app.
   * @returns Returns connected app Id or null.
   */
  getConnectedApp(
    discordGuildId: string,
    appId: string = ''
  ): Promise<string | null> {
    const query = { appId };
    const trailingUrl = `${discordGuildId}/app`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get event list connected with the Discord server
   * @param {string} appId The ID of app.
   * @param {string} discordGuildId The ID of discord guild.
   * @returns Returns event list connected discord guild.
   */
  getConnectedEventsByServer(
    appId: string,
    discordGuildId: string
  ): Promise<(EventInfo | null)[]> {
    const query = { appId };
    const trailingUrl = `${discordGuildId}/events`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Gets tasks connected with discord channel
   * @param {string} appId The ID of app.
   * @param {string} discordGuildId The ID of discord guild.
   * @param {string} discordChannelId The ID of discord channel.
   * @returns Returns a map of task IDs for each event ID.
   */
  getConnectedTasksByChannel(
    appId: string,
    discordGuildId: string,
    discordChannelId: string
  ): Promise<TaskIdListByEventId> {
    const query = { appId };
    const trailingUrl = `${discordGuildId}/${discordChannelId}/tasks`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Adds persona model to discord channel.
   * @param {string} appId The ID of app. 
   * @param {string} modelId The ID of persona model.
   * @param {string} modelName The name of persona model.
   * @param {string} discordGuildId The discord guild ID to which the model will be linked.
   * @param {string} discordChannelId The discord channel ID to which the model will be linked.
   */
  addPersonaModelToDiscordChannel(
    appId: string,
    modelId: string,
    modelName: string,
    discordGuildId: string,
    discordChannelId: string
  ): Promise<void> {
    const body = {
      appId,
      modelId,
      modelName,
      discordServerId: discordGuildId,
      discordChannelId,
    };
    const trailingUrl = `persona-models`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets persona model connected with discord channel.
   * @param {string} appId The ID of app.
   * @param {string} discordGuildId The discord guild ID to which model was connected.
   * @param {string} discordChannelId The discord channel ID to which model was connected.
   * @returns 
   */
  getPersonaModelForDiscordChannel(
    appId: string,
    discordGuildId: string,
    discordChannelId: string
  ): Promise<ChannelPersonaModelInfo | null> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordGuildId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Gets persona models connected with discord server.
   * @param {string} appId The ID of app.
   * @param {string} discordGuildId The discord build ID to which model was connected.
   * @returns Returns a Map of information about the models linked to each channel in the guild."
   */
  getPersonaModelForDiscordServer(
    appId: string,
    discordGuildId: string
  ): Promise<ServerPersonaModelInfo | null> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordGuildId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Disconnects persona model with discord channel.
   * @param {string} appId The ID of app.
   * @param {string} discordGuildId The discord guild ID to which the model will be disconnected.
   * @param {string} discordChannelId The discord channel ID to which the model will be disconnected.
   */
  deletePersonaModelFromDiscordChannel(
    appId: string,
    discordGuildId: string,
    discordChannelId: string
  ): Promise<void> {
    const query = { appId };
    const trailingUrl = `persona-models/${discordGuildId}/${discordChannelId}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * You can add new user's invitation information.
   * @param {string} appId The ID of app.
   * @param {string} eventId The ID of invitation event.
   * @param {string} taskInstanceId The ID of invitation event's task.
   * @param {string} inviteeId The ID of invitee.
   * @param {string} inviterId The ID of inviter. If you can't identify the inviter, leave blank this.
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
   * @param {string} appId The ID of app.
   * @param {string} discordGuildId The ID of discord guild.
   * @param {string} inviteeId The ID of invitee.
   * @returns {Promise<InviteInfo>} Return InviteInfo object.
   */
  getInviteInfo(
    appId: string,
    discordGuildId: string,
    inviteeId: string
  ): Promise<InviteInfo> {
    const query = { appId };
    const trailingUrl = `invite-info/${discordGuildId}/${inviteeId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
