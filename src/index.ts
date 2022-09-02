import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import Assets from './assets';
import Discord from './discord';
import EventManager from './event';
import {
  AINFT_SERVER_ENDPOINT,
  AIN_BLOCKCHAIN_CHAINID,
  AIN_BLOCKCHAIN_ENDPOINT,
} from './constants';
import { Account } from './types';

export default class AinftJs {
  private baseUrl: string;
  public accessAccount: Account;
  public assets: Assets;
  public discord: Discord;
  public eventManager: EventManager;
  public ain: Ain;

  constructor(baseUrl = AINFT_SERVER_ENDPOINT, accessAccount: Account) {
    this.baseUrl = baseUrl;
    // NOTE(liayoo): added to avoid an uninitialized error
    this.accessAccount = accessAccount;

    this.ain = new Ain(AIN_BLOCKCHAIN_ENDPOINT, AIN_BLOCKCHAIN_CHAINID);
    this.setAccessAccount(accessAccount);

    this.assets = new Assets(this.baseUrl);
    this.discord = new Discord(
      this.baseUrl,
      this.accessAccount.address,
      this.ain,
    );
    this.eventManager = new EventManager(
      this.baseUrl,
      this.accessAccount.address,
      this.ain,
    );
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.assets.setBaseUrl(baseUrl);
    this.discord.setBaseUrl(baseUrl);
  }

  setAccessAccount(_accessAccount: Account) {
    // NOTE(liayoo): always have only 1 access account for now
    this.ain.wallet.clear();
    this.ain.wallet.add(_accessAccount.privateKey);
    this.accessAccount = _accessAccount;
  }

  async getStatus() {
    return (await axios.get(`${this.baseUrl}/status`)).data;
  }
}

export * from './types';
