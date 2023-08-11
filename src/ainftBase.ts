import Ain from "@ainblockchain/ain-js";
import stringify = require("fast-json-stable-stringify");
import axios from "axios";
import { HttpMethod, HttpMethodToAxiosMethod, SerializedMessage } from "./types";
import { buildData, isJoiError, sleep } from "./util";
import FormData from "form-data";
import { Signer } from "./signer";

export default class AinftBase {
  public baseUrl = '';
  public route: string;
  public ain: Ain;
  public signer: Signer;

  constructor(
    ain: Ain,
    signer: Signer,
    baseUrl: string,
    route?: string,
  ) {
    this.route = route || '';
    this.ain = ain;
    this.signer = signer;

    this.setBaseUrl(baseUrl);
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl + this.route;
  }

  setSigner(signer: Signer) {
    this.signer = signer;
  }

  signData(data: any) {
    if (typeof data !== 'string') {
      return this.signer.signMessage(stringify(data));
    }

    return this.signer.signMessage(data);
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
}