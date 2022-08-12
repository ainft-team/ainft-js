import axios from 'axios';
import Assets from './assets';
import { ENDPOINT } from './constants';
export default class AinftJs {
  private baseUrl: string;
  public assets: Assets;

  constructor(baseUrl = ENDPOINT) {
    this.baseUrl = baseUrl;
    // TODO(hyeonwoong): setup for authorization. e.g. signatureData.

    this.assets = new Assets(this.baseUrl);
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getStatus() {
    return (await axios.get(`${this.baseUrl}/status`)).data;
  }
}