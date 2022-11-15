import axios from 'axios';
import Ain from '@ainblockchain/ain-js';
import Asset from './asset';
import Auth from './auth';
import Discord from './discord';
import Event from './event';
import Store from './store';
import PersonaModels from "./personaModels";

export default class AinftJs {
  private baseUrl: string;
  public asset: Asset;
  public auth: Auth;
  public discord: Discord;
  public event: Event;
  public store: Store;
  public ain: Ain;
  public personaModels: PersonaModels;

  constructor(accessAccountPrivateKey: string, nftServerUrl: string, ainBlockchainUrl: string, chainId: 0 | 1) {
    this.baseUrl = nftServerUrl;
    this.ain = new Ain(ainBlockchainUrl, chainId);
    this.setAccessAccount(accessAccountPrivateKey);

    this.asset = new Asset(this.ain, this.baseUrl, '/asset');
    this.auth = new Auth(this.ain, this.baseUrl, '/auth');
    this.discord = new Discord(this.ain, this.baseUrl, '/discord');
    this.event = new Event(this.ain, this.baseUrl, '/event');
    this.store = new Store(this.ain, this.baseUrl, '/store');
    this.personaModels = new PersonaModels(
      this.ain,
      this.baseUrl,
      "/personaModels"
    );
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.asset.setBaseUrl(baseUrl);
    this.auth.setBaseUrl(baseUrl);
    this.discord.setBaseUrl(baseUrl);
    this.event.setBaseUrl(baseUrl);
    this.store.setBaseUrl(baseUrl);
    this.personaModels.setBaseUrl(baseUrl);
  }

  getAccessAccount() {
    return this.ain.wallet.defaultAccount;
  }

  setAccessAccount(accessAccountPrivateKey: string) {
    // NOTE(liayoo): always have only 1 access account for now
    this.ain.wallet.clear();
    this.ain.wallet.addAndSetDefaultAccount(accessAccountPrivateKey);
  }

  async getStatus(): Promise<{ health: true }> {
    return (await axios.get(`${this.baseUrl}/status`)).data;
  }
}

export * from './types';
