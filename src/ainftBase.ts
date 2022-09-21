import Ain from "@ainblockchain/ain-js";
import { AINFT_SERVER_ENDPOINT } from "./constants";
import stringify = require("fast-json-stable-stringify");
import axios from "axios";
import { HttpMethod, HttpMethodToAxiosMethod, SerializedMessage } from "./types";
import { buildData } from "./util";

export default class AinftBase {
  public baseUrl = AINFT_SERVER_ENDPOINT;
  public route: string;
  public ain: Ain;

  constructor(
    ain: Ain,
    baseUrl?: string,
    route?: string,
  ) {
    this.route = route || '';
    this.ain = ain;

    if (baseUrl) {
      this.setBaseUrl(baseUrl);
    }
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

  async sendRequest(method: HttpMethod, prefix: string, trailingUrl: string, data: any) {  
    const timestamp = Date.now();
    const dataForSignature = buildData(
      method,
      `/${prefix}/${trailingUrl}`,
      timestamp,
      data
    );
    const signature = this.signData(dataForSignature);
    const headers = {
      'X-AINFT-Date': timestamp,
      Authorization: `AINFT ${signature}`,
    };
    try {
      if (method === HttpMethod.GET || method === HttpMethod.DELETE) {
        const { data: receivedData }: SerializedMessage = (await axios[HttpMethodToAxiosMethod[method]](
          `${this.baseUrl}/${trailingUrl}`, { params: data, headers }
        )).data;
        return receivedData;
      } else if (method === HttpMethod.POST || method === HttpMethod.PUT) {
        const { data: receivedData }: SerializedMessage = (await axios[HttpMethodToAxiosMethod[method]](
          `${this.baseUrl}/${trailingUrl}`, data, { headers }
        )).data;
        return receivedData;
      } else {
        throw Error(`Invalid http method: ${method}`);
      } 
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        throw err.response?.data;
      } else {
        throw err;
      }
    }
  }
}