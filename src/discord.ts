import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import stringify  = require('fast-json-stable-stringify');
import { TaskIdListByEventId, EventInfo } from './types';

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
    const timestamp = Date.now();
    const body = { appId, discordServerId, userId };
    const data = {
      method: 'POST',
      path: '/discord/register',
      timestamp,
      body: stringify(body)
    }
    const signature = this.ain.wallet.sign(stringify(data));
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

  getConnectedApp(discordServerId: string, appId: string = ''): Promise<string> {
    const timestamp = Date.now();
    const querystring = { appId };
    const data = {
      method: 'GET',
      path: '/discord/app',
      timestamp,
      querystring: stringify(querystring)
    }
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${discordServerId}/app`, {
        params: querystring,
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
    discordServerId: string,
  ): Promise<EventInfo[]> {
    const timestamp = Date.now();
    const querystring = { appId };
    const data = {
      method: 'GET',
      path: '/discord/events',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${discordServerId}/events`, {
        params: querystring,
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
    const querystring = { appId };
    const data = {
      method: 'GET',
      path: '/discord/tasks',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${discordServerId}/${discordChannelId}/tasks`, {
        params: querystring,
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
