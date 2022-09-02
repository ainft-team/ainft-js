import Ain from '@ainblockchain/ain-js';
import axios from 'axios';
import stringify = require('fast-json-stable-stringify');
import { AddEventActivityParams, CreateEventParams, TokenomicsEvent } from './types';

export default class EventManager {
  private baseUrl: string;
  public accessAddress: string;
  public ain: Ain;

  constructor(
    baseUrl: string,
    accessAddress: string,
    ain: Ain,
  ) {
    this.baseUrl = `${baseUrl}/event`;
    this.accessAddress = accessAddress;
    this.ain = ain;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = `${baseUrl}/event`;
  }

  createEvent({
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

  updateEvent(
    appId: string,
    eventId: string,
    userId: string,
    payload: Partial<TokenomicsEvent>
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

  deleteEvent(appId: string, eventId: string, userId: string) {
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

        data: {
          appId,
          eventId,
          userId,
          accessAinAddress: this.accessAddress,
          signature: this.signature,
          data: this.signatureData,
        },
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getTaskTypeList() {
    return axios
      .get(`${this.baseUrl}/task-types`)
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getRewardTypeList() {
    return axios
      .get(`${this.baseUrl}/reward-types`)
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}
