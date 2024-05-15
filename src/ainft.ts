import axios from 'axios';
import _ from 'lodash';
import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import * as AinUtil from '@ainblockchain/ain-util';
import { AinWalletSigner } from '@ainblockchain/ain-js/lib/signer/ain-wallet-signer';
import { Signer } from '@ainblockchain/ain-js/lib/signer/signer';

import Nft from './nft';
import Credit from './credit';
import Auth from './auth';
import Discord from './discord';
import Event from './event';
import Store from './store';
import PersonaModels from './personaModels';
import TextToArt from './textToArt';
import Activity from './activity';
import Eth from './eth';
import { Chat, Assistants, Threads, Messages } from './ai';
import {
  AINFT_SERVER_ENDPOINT,
  AIN_BLOCKCHAIN_CHAIN_ID,
  AIN_BLOCKCHAIN_ENDPOINT,
} from './constants';

export interface ClientOptions {
  privateKey?: string;
  signer?: Signer;
  baseURL?: string | null;
  blockchainURL?: string | null;
  chainId?: 0 | 1 | null;
}

/**
 * A class that establishes a blockchain and ainft server connection and initializes other classes.
 */
export default class AinftJs {
  public ain: Ain;
  public ainize: Ainize;
  public nft: Nft;
  public credit: Credit;
  public auth: Auth;
  public discord: Discord;
  public event: Event;
  public store: Store;
  public personaModels: PersonaModels;
  public textToArt: TextToArt;
  public activity: Activity;
  public eth: Eth;
  public chat: Chat;
  public assistant: Assistants;
  public thread: Threads;
  public message: Messages;

  private _baseURL: string;
  private _blockchainURL: string;
  private _chainId: 0 | 1;

  constructor({ privateKey, signer, baseURL, blockchainURL, chainId }: ClientOptions = {}) {
    if (privateKey === undefined && signer === undefined) {
      throw new Error('must provide either private key or signer');
    }

    this._baseURL = baseURL || 'https://ainft-api.ainetwork.ai';
    const stage = this.getStage(this._baseURL);
    this._blockchainURL = blockchainURL || AIN_BLOCKCHAIN_ENDPOINT[stage];
    this._chainId = chainId || AIN_BLOCKCHAIN_CHAIN_ID[stage];

    this.ain = new Ain(this._blockchainURL, undefined, this._chainId);
    this.ainize = new Ainize(this._chainId);

    this.setCredentials(privateKey, signer);

    this.nft = new Nft(this._baseURL, '/nft', this.ain);
    this.eth = new Eth(this._baseURL, '/nft', this.ain);
    this.credit = new Credit(this._baseURL, '/credit', this.ain);
    this.auth = new Auth(this._baseURL, '/auth', this.ain, this.ainize);
    this.discord = new Discord(this._baseURL, '/discord', this.ain);
    this.event = new Event(this._baseURL, '/event', this.ain);
    this.store = new Store(this._baseURL, '/store', this.ain);
    this.personaModels = new PersonaModels(this._baseURL, '/persona-models', this.ain);
    this.textToArt = new TextToArt(this._baseURL, '/text-to-art', this.ain);
    this.activity = new Activity(this._baseURL, '/activity', this.ain);
    this.chat = new Chat(this._baseURL, null, this.ain, this.ainize);
    this.assistant = new Assistants(this._baseURL, null, this.ain, this.ainize);
    this.thread = new Threads(this._baseURL, null, this.ain, this.ainize);
    this.message = new Messages(this._baseURL, null, this.ain, this.ainize);
  }

  /**
   * Set a new baseUrl. Enter the AINFT server endpoint.
   * @param baseUrl
   */
  setBaseUrl(baseUrl: string) {
    this._baseURL = baseUrl;
    this.nft.setBaseUrl(baseUrl);
    this.credit.setBaseUrl(baseUrl);
    this.auth.setBaseUrl(baseUrl);
    this.discord.setBaseUrl(baseUrl);
    this.event.setBaseUrl(baseUrl);
    this.store.setBaseUrl(baseUrl);
    this.personaModels.setBaseUrl(baseUrl);
    this.textToArt.setBaseUrl(baseUrl);
    this.activity.setBaseUrl(baseUrl);
  }

  /**
   * Set AIN blockchain network info
   * @param providerUrl
   * @param chainId
   */
  setAiNetworkInfo(providerUrl: string, chainId: number, axiosConfig?: any) {
    this.ain.setProvider(providerUrl, undefined, chainId, axiosConfig);
  }

  /**
   * Return the currently registered Access Account.
   * @returns
   */
  getAccessAccount() {
    return this.ain.wallet.defaultAccount;
  }

  setCredentials(privateKey?: string, signer?: Signer) {
    if (privateKey) {
      this.setPrivateKey(privateKey);
    } else if (signer) {
      this.setSigner(signer);
    }
  }

  /**
   * Set a new privateKey. From now on, you can access the apps that match your new privateKey.
   * @param privateKey
   */
  setPrivateKey(privateKey: string) {
    // NOTE(liayoo): always have only 1 access account for now
    this.ain.wallet.clear();
    this.ain.wallet.addAndSetDefaultAccount(privateKey);
  }

  setSigner(signer: Signer) {
    this.ain.setSigner(signer);
  }

  setAinWalletSigner() {
    const signer = new AinWalletSigner();
    this.setSigner(signer);
  }

  async open() {
    const privateKey = this.ain.wallet.defaultAccount?.private_key;
    if (privateKey) {
      await this.ainize.login(privateKey);
    } else {
      await this.ainize.loginWithSigner()
    }
  }

  async close() {
    await this.ainize.logout();
  }

  /**
   * Return the status of the AINFT server.
   * @returns
   */
  async getStatus(): Promise<{ health: boolean }> {
    return (await axios.get(`${this._baseURL}/status`)).data;
  }

  static createAccount() {
    return AinUtil.createAccount();
  }

  private getStage(endpoint: string) {
    if (AINFT_SERVER_ENDPOINT.prod === endpoint) {
      return 'prod';
    }
    return 'dev';
  }
}

export * from './types';
