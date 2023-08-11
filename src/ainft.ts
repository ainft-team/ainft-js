import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import * as AinUtil from '@ainblockchain/ain-util';
import Nft from './nft';
import Credit from './credit';
import Auth from './auth';
import Discord from './discord';
import Event from './event';
import Store from './store';
import PersonaModels from './personaModels';
import TextToArt from './textToArt';
import Activity from './activity';
import { AINFT_SERVER_ENDPOINT, AIN_BLOCKCHAIN_CHAINID, AIN_BLOCKCHAIN_ENDPOINT } from './constants';
import { serializeEndpoint } from './util';
import { DefaultSigner, Signer } from './signer';

export default class AinftJs {
  private baseUrl: string;
  public nft: Nft;
  public credit: Credit;
  public auth: Auth;
  public discord: Discord;
  public event: Event;
  public store: Store;
  public ain: Ain;
  public personaModels: PersonaModels;
  public textToArt: TextToArt;
  public activity: Activity;
  public signer: Signer;

  constructor(
    privateKey: string,
    ainftServerEndpoint: string,
    ainBlockchainEndpoint?: string,
    chainId?: number,
  ) {
    const _ainftServerEndpoint = serializeEndpoint(ainftServerEndpoint);
    const stage = this.getStage(_ainftServerEndpoint);

    this.baseUrl = _ainftServerEndpoint;
    this.ain = new Ain(ainBlockchainEndpoint || AIN_BLOCKCHAIN_ENDPOINT[stage], chainId || AIN_BLOCKCHAIN_CHAINID[stage]);
    this.setPrivateKey(privateKey);
    this.signer = new DefaultSigner(this.ain);

    this.nft = new Nft(this.signer, this.baseUrl, '/nft'); 
    this.credit = new Credit(this.signer, this.baseUrl, '/credit');
    this.auth = new Auth(this.signer, this.baseUrl, '/auth');
    this.discord = new Discord(this.signer, this.baseUrl, '/discord');
    this.event = new Event(this.signer, this.baseUrl, '/event');
    this.store = new Store(this.signer, this.baseUrl, '/store');
    this.personaModels = new PersonaModels(this.signer, this.baseUrl, '/persona-models');
    this.textToArt = new TextToArt(this.signer, this.baseUrl, '/text-to-art');
    this.activity = new Activity(this.signer, this.baseUrl, '/activity');
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
  setAiNetworkInfo(
    providerUrl: string,
    chainId: number,
    axiosConfig?: any
  ) {
    this.ain.setProvider(providerUrl, chainId, axiosConfig);
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
    this.signer = signer;
    this.nft.setSigner(signer);
    this.credit.setSigner(signer);
    this.auth.setSigner(signer);
    this.discord.setSigner(signer);
    this.event.setSigner(signer);
    this.store.setSigner(signer);
    this.personaModels.setSigner(signer);
    this.textToArt.setSigner(signer);
    this.activity.setSigner(signer);
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
