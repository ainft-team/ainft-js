import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import { Account } from '@ainblockchain/ain-js/lib/types';
import Asset from './asset';
import Auth from './auth';
import Discord from './discord';
import Event from './event';
import {
  AINFT_SERVER_ENDPOINT,
  AIN_BLOCKCHAIN_CHAINID,
  AIN_BLOCKCHAIN_ENDPOINT,
} from './constants';

export default class AinftJs {
  private baseUrl: string;
  public asset: Asset;
  public auth: Auth;
  public discord: Discord;
  public event: Event;
  public ain: Ain;

  constructor(baseUrl = AINFT_SERVER_ENDPOINT, accessAccountPrivateKey: string) {
    this.baseUrl = baseUrl;
    this.ain = new Ain(AIN_BLOCKCHAIN_ENDPOINT, AIN_BLOCKCHAIN_CHAINID);
    this.setAccessAccount(accessAccountPrivateKey);

    this.asset = new Asset(this.baseUrl, this.ain);
    this.auth = new Auth(this.baseUrl, this.ain);
    this.discord = new Discord(this.baseUrl, this.ain);
    this.event = new Event(this.baseUrl, this.ain);
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.asset.setBaseUrl(baseUrl);
    this.auth.setBaseUrl(baseUrl);
    this.discord.setBaseUrl(baseUrl);
    this.event.setBaseUrl(baseUrl);
  }

  getAccessAccount() {
    return this.ain.wallet.defaultAccount;
  }

  setAccessAccount(accessAccountPrivateKey: string) {
    // NOTE(liayoo): always have only 1 access account for now
    this.ain.wallet.clear();
    this.ain.wallet.addAndSetDefaultAccount(accessAccountPrivateKey);
  }

  async getStatus() {
    return (await axios.get(`${this.baseUrl}/status`)).data;
  }
}

export * from './types';
