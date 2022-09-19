import axios from 'axios';
import AinftBase from './ainftBase';
import { HttpMethod } from './types';
import { buildData } from './util';

export default class Asset extends AinftBase {
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
