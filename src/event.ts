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
    userId,
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
      userId,
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
      path: '/event/create',
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/create`, body, {
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

  update(
    appId: string,
    eventId: string,
    userId: string,
    payload: Partial<CreateEventParams>
  ) {
    const timestamp = Date.now();
    const body = {
      appId,
      eventId,
      userId,
      payload,
    };
    const data = {
      method: 'PUT',
      path: '/event/update',
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .put(`${this.baseUrl}/update`, body, {
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

  delete(appId: string, eventId: string, userId: string) {
    const timestamp = Date.now();
    const querystring = { appId, eventId, userId };
    const data = {
      method: 'DELETE',
      path: '/event/delete',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .delete(`${this.baseUrl}/delete`, {
        params: querystring,
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
    const querystring = { appId, eventId };
    const data = {
      method: 'GET',
      path: '/event/get',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${eventId}`, {
        params: { appId },
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
      path: '/event/add-activity',
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/${eventId}/add-activity`, body, {
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
    const querystring = { appId };
    const data = {
      method: 'GET',
      path: '/event/task-types',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/task-types`, {
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

  getRewardTypeList(appId: string) {
    const timestamp = Date.now();
    const querystring = { appId };
    const data = {
      method: 'GET',
      path: '/event/reward-types',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/reward-types`, {
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

  async getPendingRewards(appId: string, userId: string, eventId: string) {
    const timestamp = Date.now();
    const querystring = { appId, userId, eventId };
    const data = {
      method: 'GET',
      path: '/event/pending-rewards',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/pending-rewards`, {
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
      eventId,
    };
    if (options) body.options = options;
    const data = {
      method: 'POST',
      path: '/event/reward',
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/reward`, body, {
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
