import Ain from "@ainblockchain/ain-js";
import { AINFT_SERVER_ENDPOINT } from "./constants";
import stringify = require("fast-json-stable-stringify");

export default class AinftBase {
  public baseUrl = AINFT_SERVER_ENDPOINT;
  public route: string;
  public ain: Ain;

  constructor(
    ain: Ain,
    baseUrl = AINFT_SERVER_ENDPOINT,
    route?: string,
  ) {
    this.route = route || '';
    this.ain = ain;

    this.setBaseUrl(baseUrl);
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl + this.route;
  }

  signData(data: any) {
    if (typeof data !== 'string') {
      return this.ain.wallet.sign(stringify(data));
    }

    return this.ain.wallet.sign(data);
  }
}