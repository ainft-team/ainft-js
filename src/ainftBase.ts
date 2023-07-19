import Ain from "@ainblockchain/ain-js";
import stringify = require("fast-json-stable-stringify");
import axios from "axios";
import { HttpMethod, HttpMethodToAxiosMethod, SerializedMessage } from "./types";
import { buildData, isJoiError, sleep } from "./util";
import FormData from "form-data";

export default class AinftBase {
  public baseUrl = '';
  public route: string;
  public ain: Ain;

  constructor(
    ain: Ain,
    baseUrl: string,
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

  async sendRequest(method: HttpMethod, trailingUrl: string, data?: Record<string, any>) {  
    const timestamp = Date.now();
    const dataForSignature = buildData(
      method,
      `${this.route}/${trailingUrl}`,
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
        const response: SerializedMessage = (await axios[HttpMethodToAxiosMethod[method]](
          `${this.baseUrl}/${trailingUrl}`, { params: data, headers }
        )).data;
        return response.data || response;
      } else if (method === HttpMethod.POST || method === HttpMethod.PUT) {
        const response: SerializedMessage = (await axios[HttpMethodToAxiosMethod[method]](
          `${this.baseUrl}/${trailingUrl}`, data, { headers }
        )).data;
        return response.data || response;
      } else {
        throw Error(`Invalid http method: ${method}`);
      } 
    } catch (err: any) {
      if (isJoiError(err)) {
        throw err.response?.data?.details[0];
      } else if (axios.isAxiosError(err)) {
        throw err.response?.data;
      } else {
        throw err;
      }
    }
  }

  async sendFormRequest(method: HttpMethod.POST | HttpMethod.PUT, trailingUrl: string, stringFields: {
    [key: string]: string
  }, fileFields: {
    [key: string]: {
      filename: string;
      buffer: Buffer
    }
  }) {  
    const timestamp = Date.now();
    const form = new FormData();
    Object.entries(stringFields).forEach(([key, value]) => {
      form.append(key, value);
    })
    Object.entries(fileFields).forEach(([key, { filename, buffer }]) => {
      form.append(key, buffer, filename);
    })
    const dataForSignature = buildData(
      method,
      `${this.route}/${trailingUrl}`,
      timestamp,
      stringFields
    );
    const signature = this.signData(dataForSignature);
    const headers = {
      'X-AINFT-Date': timestamp,
      Authorization: `AINFT ${signature}`,
      ...form.getHeaders()
    };
    try {
      const { data: receivedData }: SerializedMessage = (await axios[HttpMethodToAxiosMethod[method]](
        `${this.baseUrl}/${trailingUrl}`, form, { headers }
      )).data;
      return receivedData;
    } catch (err: any) {
      if (isJoiError(err)) {
        throw err.response?.data?.details[0];
      } else if (axios.isAxiosError(err)) {
        throw err.response?.data;
      } else {
        throw err;
      }
    }
  }

  async waitTransaction(hash: string, maxCount: number) {
    let count = 0;
    while (maxCount > count) {
      const transaction = await this.ain.getTransaction(hash);
      if (transaction.is_finalized) {
        break;
      }
      await sleep(10000);
      count += 1;
      console.log(`Waiting transaction - hash(${hash}), ${count}0 seconds...`);
    }
  }
}