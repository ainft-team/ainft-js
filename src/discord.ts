import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import stringify  = require('fast-json-stable-stringify');
import { TaskIdListByEventId, EventInfo, HttpMethod } from './types';
import { buildData } from './util';

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

  signData(data: any) {
    if (typeof data !== 'string') {
      return this.ain.wallet.sign(stringify(data));
    }

    return this.ain.wallet.sign(data);
  }

  connectDiscordWithApp(appId: string, discordServerId: string) {
    const timestamp = Date.now();
    const body = { appId, discordServerId };
    const data = buildData(HttpMethod.POST, '/discord/register', timestamp, body);
    const signature = this.signData(data);
    return axios
      .post(`${this.baseUrl}/register`, body, {
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getConnectedApp(
    discordServerId: string,
    appId: string = ''
  ): Promise<string> {
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(HttpMethod.GET, `/discord/${discordServerId}/app`, timestamp, query);
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${discordServerId}/app`, {
        params: query,
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getConnectedEventsByServer(
    appId: string,
    discordServerId: string
  ): Promise<EventInfo[]> {
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(
      HttpMethod.GET,
      `/discord/${discordServerId}/events`
    , timestamp, query);
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${discordServerId}/events`, {
        params: query,
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
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
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(
      HttpMethod.GET,
      `/discord/${discordServerId}/${discordChannelId}/tasks`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${discordServerId}/${discordChannelId}/tasks`, {
        params: query,
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}
