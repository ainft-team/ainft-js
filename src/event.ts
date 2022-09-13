import Ain from '@ainblockchain/ain-js';
import axios from 'axios';
import stringify = require('fast-json-stable-stringify');
import {
  AddEventActivityParams,
  CreateEventParams,
  RewardOptions,
} from './types';

export default class Event {
  private baseUrl: string;
  public ain: Ain;

  constructor(baseUrl: string, ain: Ain) {
    this.baseUrl = `${baseUrl}/event`;
    this.ain = ain;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = `${baseUrl}/event`;
  }

  create({
    appId,
    eventId,
    description,
    taskInstanceList,
    rewardInstanceList,
    startAt,
    endAt,
    platform,
  }: CreateEventParams) {
    const timestamp = Date.now();
    const body = {
      appId,
      eventId,
      description,
      taskInstanceList,
      rewardInstanceList,
      startAt,
      endAt,
      platform,
    };
    const data = {
      method: 'POST',
      path: '/event/',
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/`, body, {
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

  update({
    appId,
    eventId,
    description,
    startAt,
    endAt,
    taskInstanceList,
    rewardInstanceList,
  }: Partial<CreateEventParams>) {
    const timestamp = Date.now();
    const body = {
      appId,
      description,
      startAt,
      endAt,
      taskInstanceList,
      rewardInstanceList,
    };
    const data = {
      method: 'PUT',
      path: `/event/${eventId}`,
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .put(`${this.baseUrl}/${eventId}`, body, {
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

  delete(appId: string, eventId: string) {
    const timestamp = Date.now();
    const query = { appId };
    const data = {
      method: 'DELETE',
      path: `/event/${eventId}`,
      timestamp,
      querystring: stringify(query),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .delete(`${this.baseUrl}/${eventId}`, {
        params: query,
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

  get(appId: string, eventId: string) {
    const timestamp = Date.now();
    const query = { appId };
    const data = {
      method: 'GET',
      path: `/event/${eventId}`,
      timestamp,
      querystring: stringify(query),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${eventId}`, {
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

  addActivity({
    appId,
    userId,
    eventId,
    smartGalleryPosId,
    taskInstanceId,
    data: _data,
  }: AddEventActivityParams): Promise<string> {
    const timestamp = Date.now();
    const body = {
      appId,
      userId,
      eventId,
      smartGalleryPosId,
      taskInstanceId,
      data: _data,
    };
    const data = {
      method: 'POST',
      path: `/event/${eventId}/activity`,
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/${eventId}/activity`, body, {
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

  getTaskTypeList(appId: string) {
    const timestamp = Date.now();
    const query = { appId };
    const data = {
      method: 'GET',
      path: '/event/task-types',
      timestamp,
      querystring: stringify(query),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/task-types`, {
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

  getRewardTypeList(appId: string) {
    const timestamp = Date.now();
    const query = { appId };
    const data = {
      method: 'GET',
      path: '/event/reward-types',
      timestamp,
      querystring: stringify(query),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/reward-types`, {
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

  async getPendingRewards(appId: string, userId: string, eventId: string) {
    const timestamp = Date.now();
    const query = { appId, userId };
    const data = {
      method: 'GET',
      path: `/event/${eventId}/pending-rewards`,
      timestamp,
      querystring: stringify(query),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${eventId}/pending-rewards`, {
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

  async reward(
    appId: string,
    userId: string,
    eventId: string,
    options?: RewardOptions
  ) {
    const timestamp = Date.now();
    const body: any = {
      appId,
      userId,
    };
    if (options) body.options = options;
    const data = {
      method: 'POST',
      path: `/event/${eventId}/reward`,
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/${eventId}/reward`, body, {
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
