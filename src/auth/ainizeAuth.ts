import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

export default class AinizeAuth {
  private static instance: AinizeAuth;
  private ain: Ain | null = null;
  private ainize: Ainize | null = null;
  private loggedIn: boolean = false;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new AinizeAuth();
    }
    return this.instance;
  }

  init(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  async login() {
    if (!this.loggedIn) {
      const privateKey = this.getPrivateKeyOrThrow();
      const ainize = this.getAinizeOrThrow();
      await ainize.login(privateKey);
      this.loggedIn = true;
    }
  }

  async logout() {
    if (this.loggedIn) {
      const ainize = this.getAinizeOrThrow();
      await ainize.logout();
      this.loggedIn = false;
    }
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  private getAinOrThrow() {
    if (!this.ain) {
      throw new Error('Authentication not initialized. Please call ainizeAuth.init() first.');
    }
    return this.ain;
  }

  private getAinizeOrThrow() {
    if (!this.ainize) {
      throw new Error('Authentication not initialized. Please call ainizeAuth.init() first.');
    }
    return this.ainize;
  }

  private getPrivateKeyOrThrow() {
    const ain = this.getAinOrThrow();
    const privateKey = ain.wallet.defaultAccount?.private_key;
    if (!privateKey) {
      throw new Error('Missing private key');
    }
    return privateKey;
  }
}