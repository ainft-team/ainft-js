import AinftBase from './ainftBase';
import { INITIALIZE_GAS_FEE } from './constants';
import { HttpMethod, User } from './types';
export default class Auth extends AinftBase {

  async initializeApp(appId: string, userId: string): Promise<void> {
    const accessAccount = this.ain.wallet.defaultAccount!;
    const createAppRes = await this.createApp(appId, userId, accessAccount.address);
    console.log(`create app tx hash - ${createAppRes.txHash}`);

    const stakeAmount = await this.getInitialStakeAmount(appId, userId);
    const stakeRes = await this.stake(appId, userId, stakeAmount);
    console.log(`stake tx hash - ${stakeRes.txHash}`);

    const setRuleRes = await this.setBlockchainActivityRule(appId);
    console.log(`set rule tx hash - ${setRuleRes.txHash}`);
  }

  createApp(appId: string, userId: string, accessKey: string) {
    const body = { appId, userId, accessKey };
    const trailingUrl = 'create_app';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  stake(appId: string, userId: string, amount: number) {
    const body = { appId, userId, amount };
    const trailingUrl = 'stake';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  createUser(appId: string, userId: string): Promise<User> {
    const body = { appId, userId };
    const trailingUrl = 'create_user_account';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  createAdmin(appId: string, userId: string): Promise<User> {
    const body = { appId, userId };
    const trailingUrl = 'create_admin_account';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  setBlockchainActivityRule(appId: string) {
    const body = { appId };
    const trailingUrl = 'ain_rule/activity';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getUser(appId: string, userId: string): Promise<User> {
    const query = { appId };
    const trailingUrl = `user/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  addUserEthAddress(
    appId: string,
    userId: string,
    ethAddress: string
  ): Promise<User> {
    const body = {
      appId,
      ethAddress,
    };
    const trailingUrl = `user/${userId}/ethAddress`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  removeUserEthAddress(
    appId: string,
    userId: string,
    ethAddress: string
  ): Promise<User> {
    const query = {
      appId,
      ethAddress,
    };
    const trailingUrl = `user/${userId}/ethAddress`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  private async getInitialStakeAmount(appId: string, userId: string) {
    const user = await this.getUser(appId, userId);
    const balance = await this.ain.wallet.getBalance(user.address);
    return balance - INITIALIZE_GAS_FEE;
  }
}
