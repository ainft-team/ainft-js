import axios from 'axios';
import { CreateEventParams, TokenomicsEvent } from './types';

export default class EventManager {
  private baseUrl: string;
  public accessAddress: string;
  public signature: string;
  public signatureData: any;

  constructor(
    baseUrl: string,
    accessAddress: string,
    signature: string,
    signatureData: any
  ) {
    this.baseUrl = `${baseUrl}/event`;
    this.accessAddress = accessAddress;
    this.signature = signature;
    this.signatureData = signatureData;
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
    return axios
      .post(`${this.baseUrl}/create`, {
        appId,
        userId,
        eventId,
        description,
        taskInstanceList,
        rewardInstanceList,
        startAt,
        endAt,
        platform,
        accessAinAddress: this.accessAddress,
        signature: this.signature,
        data: this.signatureData,
      })
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
    return axios
      .put(`${this.baseUrl}/update`, {
        appId,
        eventId,
        userId,
        payload,
        accessAinAddress: this.accessAddress,
        signature: this.signature,
        data: this.signatureData,
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  deleteEvent(appId: string, eventId: string, userId: string) {
    return axios
      .delete(`${this.baseUrl}/delete`, {
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
