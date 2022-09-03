import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import stringify  = require('fast-json-stable-stringify');
import { TaskIdListByEventId, EventIdListByChannel } from './types';

export default class Discord {
  private baseUrl: string;
  public ain: Ain;

  constructor(baseUrl: string, ain: Ain) {
    this.baseUrl = `${baseUrl}/discord`;
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

  getConnectedApp(appId: string, discordServerId: string): Promise<string> {
    const data = { appId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${discordServerId}/app`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getConnectedEventsByServer(
    appId: string,
    discordServerId: string,
  ): Promise<EventIdListByChannel> {
    const data = { appId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${discordServerId}/events`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getConnectedTasksByChannel(
    appId: string,
    discordServerId: string,
    discordChannelId: string
  ): Promise<TaskIdListByEventId> {
    const data = { appId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${discordServerId}/${discordChannelId}/tasks`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}
