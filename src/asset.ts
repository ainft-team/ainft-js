import Ain from '@ainblockchain/ain-js';
import axios from 'axios';
import stringify = require('fast-json-stable-stringify');
import { HttpMethod } from './types';
import { buildData } from './util';

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

  signData(data: any) {
    if (typeof data !== 'string') {
      return this.ain.wallet.sign(stringify(data));
    }

    return this.ain.wallet.sign(data);
  }

  async getUserNftList(
    appId: string,
    chainId: string,
    ethAddress: string,
    contractAddress?: string
  ) {
    const timestamp = Date.now();
    const query = { appId };
    const trailingUrl = contractAddress
      ? `nft/${chainId}/${ethAddress}/${contractAddress}`
      : `nft/${chainId}/${ethAddress}`;
    const data = buildData(
      HttpMethod.GET,
      `/asset/${trailingUrl}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${trailingUrl}`, {
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

  async getUserCreditBalance(appId: string, symbol: string, userId: string) {
    const timestamp = Date.now();
    const query = { appId };
    const trailingUrl = `credit/${symbol}/${userId}`;
    const data = buildData(
      HttpMethod.GET,
      `/asset/${trailingUrl}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${trailingUrl}`, {
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
