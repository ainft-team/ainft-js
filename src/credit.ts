import FactoryBase from './factoryBase';
import {
  AppCreditInfo,
  HttpMethod,
  AppWithdrawList,
  UserWithdrawList,
  WithdrawRequestMap,
  DepositTransaction,
  LockupList,
  DepositHistory,
} from './types';

// TODO(kriii): Objectify params?
/**
 * The class for creating and managing credits to be used in each app.
 */
export default class Credit extends FactoryBase {
  /**
   * Creates credit to use in app.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} name The name of credit.
   * @param {number} maxSupply Maximum number of credits that can be generated.
   * @returns
   */
  createAppCredit(
    appId: string,
    symbol: string,
    name: string,
    maxSupply?: number
  ): Promise<AppCreditInfo> {
    const body = {
      appId,
      symbol,
      name,
      ...(maxSupply && { maxSupply }),
    };
    const trailingUrl = 'symbol';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets app credit info.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @returns Returns credit information.
   */
  getAppCredit(appId: string, symbol: string): Promise<AppCreditInfo> {
    const query = {
      appId,
    };
    const trailingUrl = `symbol/${symbol}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Deletes app credit.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   */
  deleteAppCredit(appId: string, symbol: string): Promise<void> {
    const query = {
      appId,
    };
    const trailingUrl = `symbol/${symbol}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Mints app credit to user.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} to The ID of user the credit will be minted.
   * @param {number} amount The amount of credit to mint.
   * @param {object} payload The additional data about minting.
   * @returns
   */
  mintAppCredit(
    appId: string,
    symbol: string,
    to: string,
    amount: number,
    payload?: object
  ): Promise<void> {
    const body = {
      appId,
      to,
      amount,
      ...(payload && { payload }),
    };
    const trailingUrl = `symbol/${symbol}/mint`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Burn credit from user.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} from The ID of user the credit will be burned.
   * @param {number} amount The amount of credit to burn.
   * @param {object} payload The additional data about burning.
   * @returns
   */
  burnAppCredit(
    appId: string,
    symbol: string,
    from: string,
    amount: number,
    payload?: object
  ): Promise<void> {
    const body = {
      appId,
      from,
      amount,
      ...(payload && { payload }),
    };
    const trailingUrl = `symbol/${symbol}/burn`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  // NOTE(liayoo): calling this function will create a user if the recipient ('to') doesn't exist.
  /**
   * Transfer app credit to user.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} from The address the credit will send from. 
   * @param {string} to The address the credit will send to.
   * @param {number} amount The amount of credit to transfer.
   * @param {object} payload The additional data about transferring.
   * @returns
   */
  transferAppCredit(
    appId: string,
    symbol: string,
    from: string,
    to: string,
    amount: number,
    payload?: object
  ): Promise<void> {
    const body = {
      appId,
      from,
      to,
      amount,
      ...(payload && { payload }),
    };
    const trailingUrl = `symbol/${symbol}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * You can request withdraw app credit to crypto wallet.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} userId The ID of user who request withdraw.
   * @param {string} chain The symbol of chain.
   * @param {number} amount The amount of withdraw credit.
   * @param {string} userAddress The address where will receive withdraw credit.
   */
  withdrawAppCredit(
    appId: string,
    symbol: string,
    userId: string,
    chain: string,
    amount: number,
    userAddress: string,
  ): Promise<void> {
    const body = {
      appId,
      userId,
      chain,
      amount,
      userAddress,
    };
    const trailingUrl = `symbol/${symbol}/withdraw`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * You can get withdrawal list applied by all users
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @return {Promise<AppWithdrawList>} Return AppWithdrawList Object
   */
  getWithdrawList(appId: string, symbol: string): Promise<AppWithdrawList> {
    const query = { appId };
    const trailingUrl = `symbol/${symbol}/withdraw`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * You can get withdrawal list apllied by one user
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} userId The ID of user.
   * @returns {Promise<UserWithdrawList>} Return UserWithdrawList Object
   */
  getWithdrawListByUserId(
    appId: string,
    symbol: string,
    userId: string,
  ): Promise<UserWithdrawList> {
    const query = { appId };
    const trailingUrl = `symbol/${symbol}/withdraw/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get the user's credit balance
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} userId The ID of user.
   * @returns {Promise<number>} A Promise that resolves to the credit balance of the user
   */
  getCreditBalanceOfUser(
    appId: string,
    symbol: string,
    userId: string,
  ): Promise<number> {
    const query = { appId };
    const trailingUrl = `symbol/${symbol}/balance/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get the credit balance of all users
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @returns {Promise<{[userId: string]: number}>} A Promise that resolves to the credit balance of all users.
   */
  getCreditBalances(
    appId: string,
    symbol: string,
  ): Promise<{ [userId: string]: number }> {
    const query = { appId };
    const trailingUrl = `symbol/${symbol}/balance`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Reflects withdraws complete status to server after transfer tokens
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {WithdrawRequestMap} requestMap A map containing withdrawal request information for each user.
   * @param {string} txHash Hash of transfer transaction.
   */
  withdrawComplete(
    appId: string,
    symbol: string,
    requestMap: WithdrawRequestMap,
    txHash: string,
  ): Promise<void> {
    const body = { appId, requestList: requestMap, txHash };
    const trailingUrl = `symbol/${symbol}/withdraw/complete`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Rejects requested withdrawals.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {withdrawRequestList} requestList A map containing withdrawal request information to reject.
   * @param {string} reason The reason for the reject.
   */
  rejectWithdrawal(
    appId: string,
    symbol: string,
    requestList: WithdrawRequestList,
    reason: string,
  ): Promise<void> {
    const body = { appId, requestList, reason };
    const trailingUrl = `symbol/${symbol}/withdraw/reject`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
  
  /**
   * You can restrict the user to leave a certain amount of credit
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} userId The ID of user.
   * @param {number} amount The amount of credit to lock.
   * @param {number} endAt The timestamp when the lockup period ends.
   * @param {string} reason The reason for the lockup.
   */
  lockupUserBalance(
    appId: string,
    symbol: string,
    userId: string,
    amount: number,
    endAt: number,
    reason?: string,
  ): Promise<void> {
    const body = {
      appId,
      userId,
      amount,
      endAt,
      reason,
    };
    const trailingUrl = `symbol/${symbol}/lockup`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets a user's lockup list.
   * @param {string} appId The ID of app.
   * @param {string} symbol The symbol of credit.
   * @param {string} userId The ID of user.
   * @returns Returns lockup list by userId.
   */
  getUserLockupList(
    appId: string,
    symbol: string,
    userId: string,
  ): Promise<LockupList> {
    const query = {
      appId,
    };
    const trailingUrl = `symbol/${symbol}/lockup/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Deposits user's credits to Crypto tokens.
   * @param {string} appId The ID of app.
   * @param {DepositTransaction} transaction The transaction information about deposit.
   */
  depositToken(appId: string, transaction: DepositTransaction): Promise<void> {
    const body = { appId, transaction };
    const trailingUrl = `deposit/transaction`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets user's deposit history.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user.
   * @param {string} chain The symbol of chain.
   * @returns {Promise<DepositHistory>} Returns depositHistory list of user.
   */
  getDepositHistory(
    appId: string,
    userId: string,
    chain?: string,
  ): Promise<DepositHistory> {
    const query = { appId, chain };
    const trailingUrl = `deposit/history/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
