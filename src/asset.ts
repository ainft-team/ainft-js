import axios from 'axios';
import AinftBase from './ainftBase';
import { HttpMethod } from './types';
import { buildData } from './util';

export default class Asset extends AinftBase {
  async getNftContractBySymbol(appId: string, symbol: string) {
    const timestamp = Date.now();
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'nft';
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

  async getNft(
    appId: string,
    chainId: string,
    contractAddress: string,
    tokenId: string,
  ) {
    const timestamp = Date.now();
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `nft/${chainId}`;
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

  async getUserNftList(
    appId: string,
    chainId: string,
    ethAddress: string,
    contractAddress?: string,
    tokenId?: string,
  ) {
    const timestamp = Date.now();
    const query: any = { appId };
    if (contractAddress) query.contractAddress = contractAddress;
    if (tokenId) query.tokenId = tokenId;
    const trailingUrl = `nft/${chainId}/${ethAddress}`;
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
