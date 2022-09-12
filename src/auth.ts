import Ain from '@ainblockchain/ain-js';
import axios from 'axios';
import stringify = require('fast-json-stable-stringify');
import { User } from './types';

export default class Auth {
  private baseUrl: string;
  public ain: Ain;

  constructor(baseUrl: string, ain: Ain) {
    this.baseUrl = `${baseUrl}/auth`;
    this.ain = ain;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = `${baseUrl}/auth`;
  }

  getUser(appId: string, userId: string): Promise<User> {
    const timestamp = Date.now();
    const querystring = {
      appId,
      userId,
    };
    const data = {
      method: 'GET',
      path: '/auth/user',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/user`, {
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

  addUserEthAddress(appId: string, userId: string, ethAddress: string): Promise<User> {
    const timestamp = Date.now();
    const body = {
      appId,
      userId,
      ethAddress,
    };
    const data = {
      method: 'POST',
      path: '/auth/user/ethAddress',
      timestamp,
      body: stringify(body),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/user/ethAddress`, body, {
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

  removeUserEthAddress(appId: string, userId: string, ethAddress: string): Promise<User> {
    const timestamp = Date.now();
    const querystring = {
      appId,
      userId,
      ethAddress,
    };
    const data = {
      method: 'DELETE',
      path: '/auth/user/ethAddress',
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .delete(`${this.baseUrl}/user/ethAddress`, {
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
