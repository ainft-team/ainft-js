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
    const data = {
      appId,
      userId,
      timestamp: Date.now(),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/user`, {
        data: { data, signature },
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  addUserEthAddress(appId: string, userId: string, ethAddress: string): Promise<User> {
    const data = {
      appId,
      userId,
      ethAddress,
      timestamp: Date.now(),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .post(`${this.baseUrl}/user/ethAddress`, { data, signature })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  removeUserEthAddress(appId: string, userId: string, ethAddress: string): Promise<User> {
    const data = {
      appId,
      userId,
      ethAddress,
      timestamp: Date.now(),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .delete(`${this.baseUrl}/user/ethAddress`, {
        data: { data, signature },
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}
