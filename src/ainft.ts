import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import Asset from './asset';
import Auth from './auth';
import Discord from './discord';
import Event from './event';
import Store from './store';
import PersonaModels from './personaModels';

export default class AinftJs {
  private baseUrl: string;
  public asset: Asset;
  public auth: Auth;
  public discord: Discord;
  public event: Event;
  public store: Store;
  public ain: Ain;
  public personaModels: PersonaModels;

  constructor(accessKey: string, nftServerEndpoint: string, ainBlockchainEndpoint: string, chainId: 0 | 1) {
    this.baseUrl = nftServerEndpoint;
    this.ain = new Ain(ainBlockchainEndpoint, chainId);
    this.setAccessKey(accessKey);

    this.asset = new Asset(this.ain, this.baseUrl, '/asset');
    this.auth = new Auth(this.ain, this.baseUrl, '/auth');
    this.discord = new Discord(this.ain, this.baseUrl, '/discord');
    this.event = new Event(this.ain, this.baseUrl, '/event');
    this.store = new Store(this.ain, this.baseUrl, '/store');
    this.personaModels = new PersonaModels(this.ain, this.baseUrl, '/persona-models');
  }

  /**
   * Set a new baseUrl. Enter the AINFT server endpoint.
   * @param baseUrl
   */
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.asset.setBaseUrl(baseUrl);
    this.auth.setBaseUrl(baseUrl);
    this.discord.setBaseUrl(baseUrl);
    this.event.setBaseUrl(baseUrl);
    this.store.setBaseUrl(baseUrl);
    this.personaModels.setBaseUrl(baseUrl);
  }

  /**
   * Returns the currently registered Access Account.
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
   * Returns the status of the AINFT server.
   * @returns 
   */
  async getStatus(): Promise<{ health: boolean }> {
    return (await axios.get(`${this.baseUrl}/status`)).data;
  }
}

export * from './types';