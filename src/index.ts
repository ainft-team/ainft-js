import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import Assets from './assets';
import Discord from './discord';
import {
  AINFT_SERVER_ENDPOINT,
  AIN_BLOCKCHAIN_CHAINID,
  AIN_BLOCKCHAIN_ENDPOINT,
} from './constants';
import { Account } from './types';

export default class AinftJs {
  private baseUrl: string;
  public accessAccount: Account;
  public signature: string;
  public signatureData: any;
  public assets: Assets;
  public discord: Discord;
  public ain: Ain;

  constructor(baseUrl = AINFT_SERVER_ENDPOINT, accessAccount: Account) {
    this.baseUrl = baseUrl;
    this.accessAccount = accessAccount;

    this.ain = new Ain(AIN_BLOCKCHAIN_ENDPOINT, AIN_BLOCKCHAIN_CHAINID);
    this.signatureData = Date.now().toString();
    this.signature = this.buildSignature(this.signatureData);

    this.assets = new Assets(this.baseUrl);
    this.discord = new Discord(
      this.baseUrl,
      this.accessAccount.address,
      this.signature,
      this.signatureData
    );
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.assets.setBaseUrl(baseUrl);
    this.discord.setBaseUrl(baseUrl);
  }

  buildSignature(data: any) {
    this.ain.wallet.add(this.accessAccount.privateKey);
    return this.ain.wallet.sign(data, this.accessAccount.address);
  }

  async getStatus() {
    return (await axios.get(`${this.baseUrl}/status`)).data;
  }
}
