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
import { setEnv } from './utils/env';

/**
 * A class that establishes a blockchain and ainft server connection and initializes other classes.
 */
export default class AinftJs {
  private baseUrl: string;
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

  constructor(
    privateKey?: string | null,
    signer?: Signer | null,
    config?: {
      ainftServerEndpoint?: string;
      ainBlockchainEndpoint?: string;
      chainId?: 0 | 1;
    }
  ) {
    this.baseUrl = _.get(config, 'ainftServerEndpoint') || AINFT_SERVER_ENDPOINT['prod'];
    const stage = this.getStage(this.baseUrl);
    const endpoint = _.get(config, 'ainBlockchainEndpoint') || AIN_BLOCKCHAIN_ENDPOINT[stage];
    const chainId = _.get(config, 'chainId') || AIN_BLOCKCHAIN_CHAIN_ID[stage];
    setEnv(stage);

    this.ain = new Ain(endpoint, undefined, chainId);
    this.ainize = new Ainize(chainId);

    if (privateKey) {
      this.setPrivateKey(privateKey);
    } else if (signer) {
      this.setSigner(signer);
    } else {
      throw new Error('Must set either a private key or a signer.');
    }

    this.nft = new Nft(this.ain, this.baseUrl, '/nft');
    this.eth = new Eth(this.ain, this.baseUrl, '/nft');
    this.credit = new Credit(this.ain, this.baseUrl, '/credit');
    this.auth = new Auth(this.ain, this.baseUrl, '/auth');
    this.discord = new Discord(this.ain, this.baseUrl, '/discord');
    this.event = new Event(this.ain, this.baseUrl, '/event');
    this.store = new Store(this.ain, this.baseUrl, '/store');
    this.personaModels = new PersonaModels(this.ain, this.baseUrl, '/persona-models');
    this.textToArt = new TextToArt(this.ain, this.baseUrl, '/text-to-art');
    this.activity = new Activity(this.ain, this.baseUrl, '/activity');
    this.chat = new Chat(this.ain, this.baseUrl, '', this.ainize);
    this.assistant = new Assistants(this.ain, this.baseUrl, '', this.ainize);
    this.thread = new Threads(this.ain, this.baseUrl, '', this.ainize);
    this.message = new Messages(this.ain, this.baseUrl, '', this.ainize);
  }

  /**
   * Set a new baseUrl. Enter the AINFT server endpoint.
   * @param baseUrl
   */
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
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

  /**
   * Return the status of the AINFT server.
   * @returns
   */
  async getStatus(): Promise<{ health: boolean }> {
    return (await axios.get(`${this.baseUrl}/status`)).data;
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
