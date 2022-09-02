import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import stringify  = require('fast-json-stable-stringify');
import { TaskIdListByEventId, EventIdListByChannel } from './types';

export default class Discord {
  private baseUrl: string;
  public accessAddress: string;
  public ain: Ain;

  constructor(
    baseUrl: string,
    accessAddress: string,
    ain: Ain,
  ) {
    this.baseUrl = `${baseUrl}/discord`;
    this.accessAddress = accessAddress;
    this.ain = ain;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = `${baseUrl}/discord`;
  }

  connectDiscordWithApp(
    appId: string,
    discordServerId: string,
    userId: string
  ) {
    const data = { appId, discordServerId, userId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/register`, { data, signature })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getConnectedApp(discordServerId: string): Promise<string> {
    return axios
      .get(`${this.baseUrl}/${discordServerId}/app`)
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getConnectedEventsByServer(discordServerId: string): Promise<EventIdListByChannel> {
    return axios
      .get(`${this.baseUrl}/${discordServerId}/events`)
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getConnectedTasksByChannel(
    discordServerId: string,
    discordChannelId: string
  ): Promise<TaskIdListByEventId> {
    return axios
      .get(`${this.baseUrl}/${discordServerId}/${discordChannelId}/tasks`)
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}
