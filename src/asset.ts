import Ain from '@ainblockchain/ain-js';
import axios from 'axios';
import stringify = require('fast-json-stable-stringify');

export default class Asset {
  private baseUrl: string;
  private ain: Ain;

  constructor(baseUrl: string, ain: Ain) {
    this.baseUrl = `${baseUrl}/asset`;
    this.ain = ain;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = `${baseUrl}/asset`;
  }

  async getUserNftList(appId: string, ethAddress: string) {
    const data = { appId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/nft-list/${ethAddress}`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  async getUserCreditBalance(appId: string, symbol: string, userId: string) {
    const data = { appId, timestamp: Date.now() };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/credit/${appId}/${symbol}/${userId}`, {
        data: { data, signature },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}