import Reference from '@ainblockchain/ain-js/lib/ain-db/ref';
import FactoryBase from './factoryBase';
import { APP_STAKING_LOCKUP_DURATION_MS, MIN_GAS_PRICE } from './constants';
import { HttpMethod, User } from './types';
export default class Auth extends FactoryBase {
  /**
   * Creates AIN Blockchain app using private key.
   * @param {string} appname - The name of app.
   * @returns Returns transaction result.
   */
  async createApp(appname: string) {
    const address = await this.ain.signer.getAddress();
    return this.ain.db.ref(`/manage_app/${appname}/create/${Date.now()}`).setValue({
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
      address,
      nonce: -1,
      gas_price: MIN_GAS_PRICE,
    });
  }

  /**
   * Creates AINFT factory user in app.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user to create.
   * @returns
   */
  createUser(appId: string, userId: string): Promise<User> {
    const body = { appId, userId };
    const trailingUrl = 'create_user_account';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Create AINFT factory admin user in app.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user to be admin.
   * @returns
   */
  createAdmin(appId: string, userId: string): Promise<User> {
    const body = { appId, userId };
    const trailingUrl = 'create_admin_account';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
  // TODO(hyeonwoong): add registerUserToAdmin and deregisterUserFromAdmin

  /**
   * Gets AINFT factory user in app.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user to get.
   * @returns Return user information.
   */
  getUser(appId: string, userId: string): Promise<User> {
    const query = { appId };
    const trailingUrl = `user/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Adds ETH address info to AINFT factory user.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user.
   * @param {string} ethAddress The ethereum address to add.
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
   * Removes ETH address info from user.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user.
   * @param {string} ethAddress The ethereum address to delete.
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
   * Registers contract to managed contract. By registering as a managed contract, metadata can be managed in AINFT Factory.
   * @param {string} appId The ID of app.
   * @param {string} chain The symbol of chain with a contract.
   * @param {string} network The name of network.
   * @param {string} contractAddress The address of contract.
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
   * Removes managed contract.
   * @param {string} appId The ID of app.
   * @param {string} chain The symbol of chain with a contract.
   * @param {string} network The name of network.
   * @param {string} contractAddress The address of contract.
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
   * Registers exsiting AIN blockchain app to AINFT Factory.
   * @param {string} appId The ID of app.
   * @param {string} accessAinAddress This is the address of the account that will be accessible to the AINFT Factory app. If not set, it is set to the address of the account set as the privateKey.
   * @returns
   */
  async registerBlockchainApp(appId: string, accessAinAddress?: string) {
    const ownerAddress = await this.ain.signer.getAddress();
    const body = {
      appId,
      ownerAddress,
      accessAinAddress,
    };
    const trailingUrl = `register_blockchain_app`;
    return await this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets transaction body to delegate app.
   * App permission is obtained from AINFT factory, and trigger function for ainft is registered.
   * @param {string} appId The ID of app.
   * @returns
   */
  async getTxBodyForDelegateApp(appId: string) {
    const address = await this.ain.signer.getAddress();
    const body = { appId, address };
    const trailingUrl = `delegate_app`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Sends transaction to delegate app using private key.
   * App permission is obtained from ainft factory, and trigger function for ainft is registered.
   * @param {string} appId The ID of app.
   * @returns
   */
  async delegateApp(appId: string) {
    const txBody = await this.getTxBodyForDelegateApp(appId);
    return this.ain.sendTransaction(txBody);
  }

  /**
   * You can get user deposit crypto address.
   * If user doesn't have address, create new deposit account.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user.
   * @param {string} chain The symbol of chain.
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
   * @param {string} appId The ID of app.
   * @param {string[]} owners The list of addresses to be owner.
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
