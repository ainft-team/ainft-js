import Ain from '@ainblockchain/ain-js';
import axios from 'axios';
import stringify = require('fast-json-stable-stringify');
import { AddEventActivityParams, CreateEventParams, RewardOptions } from './types';

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
    const data = {
      appId,
      userId,
      eventId,
      description,
      taskInstanceList,
      rewardInstanceList,
      startAt,
      endAt,
      platform,
      timestamp: Date.now(),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/create`, { data, signature })
      .then((res) => res.data)
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
    const data = {
      appId,
      eventId,
      userId,
      payload,
      timestamp: Date.now(),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .put(`${this.baseUrl}/update`, { data, signature })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  delete(appId: string, eventId: string, userId: string) {
    const data = { appId, eventId, userId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .delete(`${this.baseUrl}/delete`, { 
        data: { data, signature },
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  get(appId: string, eventId: string) {
    const data = { appId, eventId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${eventId}`, {
        params: { appId },
        data: { data, signature },
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
    const data = {
      appId,
      userId,
      eventId,
      smartGalleryPosId,
      taskInstanceId,
      data: _data,
      timestamp: Date.now(),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/${eventId}/add-activity`, { data, signature })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getTaskTypeList(appId: string) {
    const data = { appId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/task-types`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getRewardTypeList(appId: string) {
    const data = { appId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/reward-types`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  async getPendingRewards(appId: string, userId: string, eventId: string) {
    const data = { appId, userId, eventId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/pending-rewards`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  async reward(appId: string, userId: string, eventId: string, options?: RewardOptions) {
    const data: any = {
      appId,
      userId,
      eventId,
      timestamp: Date.now(),
    };
    if (options) data.options = options;
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/reward`, { data, signature })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

}
