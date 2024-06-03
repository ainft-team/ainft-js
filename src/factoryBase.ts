import Ain from "@ainblockchain/ain-js";
import Ainize from '@ainize-team/ainize-js';
import stringify = require("fast-json-stable-stringify");
import axios, { AxiosRequestHeaders } from "axios";
import { HttpMethod, HttpMethodToAxiosMethod, SerializedMessage } from "./types";
import { buildData, isJoiError } from './utils/util';
import FormData from "form-data";

/** 
 * This class supports requests to the api server of the AINFT Factory.
 */
export default class FactoryBase {
  /** The base url of api server of AINFT Factory. */
  public baseUrl = '';
  /** The subpath of api server request url. */
  public route: string;
  /** The Ain object for sign and send transaction to AIN blockchain. */
  public ain: Ain;
   /** The Ainize object for send request to AIN blockchain. */
  public ainize?: Ainize;

  constructor(
    baseUrl: string,
    route: string | null,
    ain: Ain,
    ainize?: Ainize,
  ) {
    this.route = route || '';
    this.ain = ain;
    this.ainize = ainize;

    this.setBaseUrl(baseUrl);
  }

  /**
   * Sets base url.
   * @param baseUrl New base url to be set to base url of api server of AINFT Factory.
   */
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl + this.route;
  }

  /**
   * Sign the data with the private key that the user has registered.
   * @param data The data to sign.
   * @returns Returns signature string.
   */
  signData(data: any): Promise<string> | string {
    if (typeof data !== 'string') {
      return this.ain.signer.signMessage(stringify(data));
    }

    return this.ain.signer.signMessage(stringify(data));
  }

  /**
   * Sends request to api server of AINFT Factory.
   * Authenticate by signing data.
   * @param method The method of Http request.
   * @param trailingUrl The suffix of request url.
   * @param data The data to be included in the api request.
   * @returns Returns response of api request.
   */
  async sendRequest(method: HttpMethod, trailingUrl: string, data?: Record<string, any>) {  
    const timestamp = Date.now();
    const dataForSignature = buildData(
      method,
      `${this.route}/${trailingUrl}`,
      timestamp,
      data
    );
    const signature = await this.signData(dataForSignature);
    const headers = {
      'X-AINFT-Date': timestamp,
      Authorization: `AINFT ${signature}`,
    };
    return this.sendRequestWithoutSign(method, trailingUrl, data, headers);
  }

  /**
   * Sends request to api server of AINFT Factory.
   * Used when authentication is not required.
   * @param method The method of Http request.
   * @param trailingUrl The suffix of request url.
   * @param data The data to be included in the api request.
   * @param headers The headers of Http api request.
   * @returns Returns response of api request.
   */
  async sendRequestWithoutSign(method: HttpMethod, trailingUrl: string, data?: Record<string, any>, headers?: AxiosRequestHeaders) {
    try {
      if (method === HttpMethod.GET || method === HttpMethod.DELETE) {
        const { data: receivedData }: SerializedMessage = (await axios[HttpMethodToAxiosMethod[method]](
          `${this.baseUrl}/${trailingUrl}`, { params: data, headers },
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
    } catch (error: any) {
      if (isJoiError(error)) {
        throw error.response?.data?.details[0];
      } else if (axios.isAxiosError(error)) {
        throw error.response?.data;
      } else {
        throw error;
      }
    }
  }

  /**
   * Sends request that include form to api server of AINFT Factory.
   * Used to upload asset data.
   * @param method The method of Http request.
   * @param trailingUrl The suffix of request url.
   * @param stringFields The string fields of form.
   * @param fileFields The file fields of form.
   * @returns Returns response of api request.
   */
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
    const signature = await this.signData(dataForSignature);
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