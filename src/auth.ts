import AinftBase from './ainftBase';
import { APP_STAKING_LOCKUP_DURATION_MS, MIN_GAS_PRICE } from './constants';
import { HttpMethod, User } from './types';
export default class Auth extends AinftBase {
  /**
   * Create AIN Blockchain app using private key.
   * @param appId - AppId you want.
   * @returns
   */
  async createApp(appId: string) {
    const address = this.ain.wallet.defaultAccount?.address!;
    const res = await this.ain.db
      .ref(`/manage_app/${appId}/create/${Date.now()}`)
      .setValue({
        value: {
          admin: {
            [address]: true,
          },
          service: {
            staking: {
              lockup_duration: APP_STAKING_LOCKUP_DURATION_MS,
            },
          },
        },
        nonce: -1,
        address,
        gas_price: MIN_GAS_PRICE,
      });

    return res;
  }

  /**
   * A function that stakes all initial ains. Use it if staking is not done after intializeApp.
   */
  // TODO(hyeonwoong): Add stake API with the user's personal account
  initialStake(appId: string, userId: string) {
    const body = { appId, userId };
    const trailingUrl = 'initial_stake';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Create AINFT Factory user in app.
   * @param appId
   * @param userId
   * @returns
   */
  createUser(appId: string, userId: string): Promise<User> {
    const body = { appId, userId };
    const trailingUrl = 'create_user_account';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Create AINFT Factory admin user in app.
   * @param appId
   * @param userId
   * @returns
   */
  createAdmin(appId: string, userId: string): Promise<User> {
    const body = { appId, userId };
    const trailingUrl = 'create_admin_account';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
  // TODO(hyeonwoong): add registerUserToAdmin and deregisterUserFromAdmin

  setBlockchainActivityRule(appId: string) {
    const body = { appId };
    const trailingUrl = 'ain_rule/activity';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Get user in app.
   * @param appId
   * @param userId
   * @returns
   */
  getUser(appId: string, userId: string): Promise<User> {
    const query = { appId };
    const trailingUrl = `user/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Add ETH address info to user.
   * @param appId
   * @param userId
   * @param ethAddress
   * @returns
   */
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

  /**
   * Remove ETH address info from user.
   * @param appId
   * @param userId
   * @param ethAddress
   * @returns
   */
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

  /**
   * Register contract to managed contract. By registering as a managed contract, metadata can be managed in AINFT Factory.
   * @param appId
   * @param chain
   * @param network
   * @param contractAddress
   * @returns
   */
  addManagedContract(
    appId: string,
    chain: string,
    network: string,
    contractAddress: string
  ): Promise<void> {
    const body = {
      appId,
      chain,
      network,
      contractAddress,
    };
    const trailingUrl = `managedContracts`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Remove managed contract.
   * @param appId
   * @param chain
   * @param network
   * @param contractAddress
   * @returns
   */
  removeManagedContract(
    appId: string,
    chain: string,
    network: string,
    contractAddress: string
  ): Promise<void> {
    const query = {
      appId,
      chain,
      network,
      contractAddress,
    };
    const trailingUrl = `managedContracts`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Register exsiting AIN blockchain app to AINFT Factory.
   * @param appId
   * @param accessAinAddress - This is the address of the account that can access the AINFT Factory app. If not set, it is set to the address of the account set as the privateKey.
   * @returns
   */
  async registerBlockchainApp(appId: string, accessAinAddress?: string) {
    const ownerAddress = this.ain.wallet.defaultAccount?.address;
    const body = {
      appId,
      ownerAddress,
      accessAinAddress,
    };
    const trailingUrl = `register_blockchain_app`;
    return await this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Get transaction body to delegate app.
   * App permission is obtained from ainft factory, and trigger function for ainft is registered.
   * @param appId
   * @returns
   */
  async getTxBodyForDelegateApp(appId: string) {
    const address = this.ain.wallet.defaultAccount?.address;
    const body = { appId, address };
    const trailingUrl = `delegate_app`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Send transaction to delegate app using private key.
   * App permission is obtained from ainft factory, and trigger function for ainft is registered.
   * @param appId
   * @returns
   */
  async delegateApp(appId: string) {
    const txBody = await this.getTxBodyForDelegateApp(appId);
    return this.ain.sendTransaction(txBody);
  }

  /**
   * You can get user deposit crypto address.
   * If user doesn't have address, create new deposit account.
   * @param {string} appId
   * @param {string} userId
   * @param {string} chain
   */
  getUserDepositAddress(
    appId: string,
    userId: string,
    chain: string
  ): Promise<string> {
    const body = {
      appId,
      chain,
    };
    const trailingUrl = `user/${userId}/depositAddress`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * You can add blockchain app owners.
   * @param {string} appId
   * @param {string[]} owners
   * @returns {string} transaction hash
   */
  addOwners(appId: string, owners: string[]): Promise<string> {
    const body = {
      appId,
      owners,
    };
    const trailingUrl = `app/${appId}/owner`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
