import axios from 'axios';
import AinftBase from './ainftBase';
import { HttpMethod, User } from './types';
import { buildData } from './util';

export default class Auth extends AinftBase {

  getUser(appId: string, userId: string): Promise<User> {
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(
      HttpMethod.GET,
      `/auth/user/${userId}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/user/${userId}`, {
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

  addUserEthAddress(
    appId: string,
    userId: string,
    ethAddress: string
  ): Promise<User> {
    const timestamp = Date.now();
    const body = {
      appId,
      ethAddress,
    };
    const data = buildData(
      HttpMethod.POST,
      `/auth/user/${userId}/ethAddress`,
      timestamp,
      body
    );
    const signature = this.signData(data);
    return axios
      .post(`${this.baseUrl}/user/${userId}/ethAddress`, body, {
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

  removeUserEthAddress(
    appId: string,
    userId: string,
    ethAddress: string
  ): Promise<User> {
    const timestamp = Date.now();
    const query = {
      appId,
      ethAddress,
    };
    const data = buildData(
      HttpMethod.DELETE,
      `/auth/user/${userId}/ethAddress`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .delete(`${this.baseUrl}/user/${userId}/ethAddress`, {
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
