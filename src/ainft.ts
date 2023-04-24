import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import Nft from './nft';
import Credit from './credit';
import Auth from './auth';
import Discord from './discord';
import Event from './event';
import Store from './store';
import PersonaModels from './personaModels';
import TextToArt from './textToArt';
import Activity from './activity';

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

  constructor(accessKey: string, nftServerEndpoint: string, ainBlockchainEndpoint: string, chainId: 0 | 1) {
    this.baseUrl = nftServerEndpoint;
    this.ain = new Ain(ainBlockchainEndpoint, chainId);
    this.setAccessKey(accessKey);

    this.nft = new Nft(this.ain, this.baseUrl, '/nft');
    this.credit = new Credit(this.ain, this.baseUrl, '/credit');
    this.auth = new Auth(this.ain, this.baseUrl, '/auth');
    this.discord = new Discord(this.ain, this.baseUrl, '/discord');
    this.event = new Event(this.ain, this.baseUrl, '/event');
    this.store = new Store(this.ain, this.baseUrl, '/store');
    this.personaModels = new PersonaModels(this.ain, this.baseUrl, '/persona-models');
    this.textToArt = new TextToArt(this.ain, this.baseUrl, '/text-to-art');
    this.activity = new Activity(this.ain, this.baseUrl, '/activity');
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
   * Return the currently registered Access Account.
   * @returns
   */
  getAccessAccount() {
    return this.ain.wallet.defaultAccount;
  }

  /**
   * Set a new accessKey. From now on, you can access the apps that match your new accessKey.
   * @param accessKey
   */
  setAccessKey(accessKey: string) {
    // NOTE(liayoo): always have only 1 access account for now
    this.ain.wallet.clear();
    this.ain.wallet.addAndSetDefaultAccount(accessKey);
  }

  /**
   * Return the status of the AINFT server.
   * @returns
   */
  async getStatus(): Promise<{ health: boolean }> {
    return (await axios.get(`${this.baseUrl}/status`)).data;
  }
}

export * from './types';
