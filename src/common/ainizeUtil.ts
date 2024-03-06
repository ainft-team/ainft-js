import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

export default class AinizeAuth {
  private static instance: AinizeAuth;
  private _isLoggedIn: boolean = false;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new AinizeAuth();
    }
    return this.instance;
  }

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  async login(ain: Ain, ainize: Ainize) {
    if (!this.isLoggedIn) {
      const privateKey = ain.wallet.defaultAccount?.private_key!;
      await ainize.login(privateKey);
      this._isLoggedIn = true;
    }
  }

  async logout(ainize: Ainize) {
    if (this.isLoggedIn) {
      await ainize.logout();
      this._isLoggedIn = false;
    }
  }
}
