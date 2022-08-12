import axios from 'axios';

export default class Assets {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}/assets`;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = `${baseUrl}/assets`;
  }

  async getUserNftList(ethAddress: string) {
    return (await axios.get(`${this.baseUrl}/nft-list/${ethAddress}`)).data;
  }
}