import AinftBase from './ainftBase';
import { MIN_GAS_PRICE } from './constants';
import { HttpMethod, User } from './types';
export default class Auth extends AinftBase {
  async initializeApp(appId: string, userId: string, owners?: string[]): Promise<void> {
    console.log('Starting app initialization... This may take up to a minute.');
    const accessKey = this.ain.wallet.defaultAccount?.address!;
    const createAppRes = await this.createApp(appId, userId, accessKey, owners);
    console.log(`create app tx hash - ${createAppRes.txHash}`);

    const stakeRes = await this.initialStake(appId, userId);
    console.log(`stake tx hash - ${stakeRes.txHash}`);

    const setRuleRes = await this.setBlockchainActivityRule(appId);
    console.log(`set rule tx hash - ${setRuleRes.txHash}`);
  }

  createApp(appId: string, userId: string, accessKey: string, owners?: string[]) {
    const body = { appId, userId, accessKey, owners };
    const trailingUrl = 'create_app';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
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
  // TODO(hyeonwoong): add registerUserToAdmin and deregisterUserFromAdmin

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

  async registerBlockchainApp(
    appId: string,
    userId: string,
    accessAinAddress?: string
  ) {
    const ownerAddress = this.ain.wallet.defaultAccount?.address;
    const body = {
      appId,
      userId,
      ownerAddress,
      accessAinAddress,
    };
    const trailingUrl = `register_blockchain_app`;
    const { adminAddress, txHash } = await this.sendRequest(
      HttpMethod.POST,
      trailingUrl,
      body
    );

    console.log(
      `The gas fee for setting the admin account as the owner of blockchain app has been sent.`
    );
    await this.waitTransaction(txHash, 3);

    const setOwnerRes = await this.setOwner(appId, adminAddress);
    if (setOwnerRes.result.code !== 0) {
      console.log(
        'Failed to set nft server admin address as owner. Please check fail response.'
      );
      console.log(setOwnerRes);
    } else {
      const msg =
        'You have successfully registered your blockchain app to the nft server.\n' +
        `txHash: ${setOwnerRes.tx_hash}\n\n` +
        'Apps created outside the nft server do not support initial staking. If you would like an initial staking, please contact the ainftJs team.\n\n' +
        'For smooth use of ainftJs, it is recommended to use the following function.\n' +
        '- ainftJs.auth.setBlockchainActivityRule';
      console.log(msg);
    }
  }

  private setOwner(appId: string, address: string) {
    return this.ain.db.ref(`/apps/${appId}`).setOwner({
      value: {
        '.owner': {
          owners: {
            [address]: {
              branch_owner: true,
              write_function: true,
              write_owner: true,
              write_rule: true,
            },
          },
        },
      },
      nonce: -1,
      gas_price: MIN_GAS_PRICE,
    });
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
    chain: string,
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
  addOwners(
    appId: string,
    owners: string[],
  ): Promise<string> {
    const body = {
      appId,
      owners,
    };
    const trailingUrl = `app/${appId}/owner`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
