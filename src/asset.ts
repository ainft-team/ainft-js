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

  async getUserNftList(
    appId: string,
    chainId: string,
    ethAddress: string,
    contractAddress?: string,
  ) {
    const timestamp = Date.now();
    const querystring = { appId };
    const trailingUrl = contractAddress
      ? `nft/${chainId}/${ethAddress}/${contractAddress}`
      : `nft/${chainId}/${ethAddress}`;
    const data = {
      method: 'GET',
      path: `/asset/${trailingUrl}`,
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${trailingUrl}`, {
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

  async getUserCreditBalance(appId: string, symbol: string, userId: string) {
    const timestamp = Date.now();
    const querystring = { appId };
    const trailingUrl = `credit/${appId}/${symbol}/${userId}`;
    const data = {
      method: 'GET',
      path: `/asset/${trailingUrl}`,
      timestamp,
      querystring: stringify(querystring),
    };
    const signature = this.ain.wallet.sign(stringify(data));
    return axios
      .get(`${this.baseUrl}/${trailingUrl}`, {
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