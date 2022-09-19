import axios from 'axios';
import AinftBase from './ainftBase';
import {
  AddEventActivityParams,
  CreateEventParams,
  RewardOptions,
  HttpMethod,
} from './types';
import { buildData } from './util';

export default class Event extends AinftBase {

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
    const data = buildData(HttpMethod.POST, '/event/', timestamp, body);
    const signature = this.signData(data);
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
    const data = buildData(
      HttpMethod.PUT,
      `/event/${eventId}`,
      timestamp,
      body
    );
    const signature = this.signData(data);
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
    const data = buildData(
      HttpMethod.DELETE,
      `/event/${eventId}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
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
    const data = buildData(
      HttpMethod.GET,
      `/event/${eventId}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
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
      smartGalleryPosId,
      taskInstanceId,
      data: _data,
    };
    const data = buildData(
      HttpMethod.POST,
      `/event/${eventId}/activity`,
      timestamp,
      body
    );
    const signature = this.signData(data);
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
    const data = buildData(
      HttpMethod.GET,
      '/event/task-types',
      timestamp,
      query
    );
    const signature = this.signData(data);
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
    const data = buildData(
      HttpMethod.GET,
      '/event/reward-types',
      timestamp,
      query
    );
    const signature = this.signData(data);
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
    const data = buildData(
      HttpMethod.GET,
      `/event/${eventId}/pending-rewards`,
      timestamp,
      query
    );
    const signature = this.signData(data);
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
    const data = buildData(
      HttpMethod.POST,
      `/event/${eventId}/reward`,
      timestamp,
      body
    );
    const signature = this.signData(data);
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

  async getRewardHistory(appId: string, userId: string, eventId: string) {
    const timestamp = Date.now();
    const query = {
      appId,
      userId,
    };
    const data = buildData(
      HttpMethod.GET,
      `/event/${eventId}/reward-history`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${eventId}/reward-history`, {
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
