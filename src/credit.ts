import FactoryBase from './factoryBase';
import {
  AppCreditInfo,
  HttpMethod,
  AppWithdrawList,
  UserWithdrawList,
  WithdrawRequestList,
  DepositTransaction,
  LockupList,
  DepositHistory,
} from './types';

// TODO(kriii): Objectify params?
export default class Credit extends FactoryBase {
  /**
   * Create app credit. 
   * @param {string} appId
   * @param {string} symbol
   * @param {string} name
   * @param {number} maxSupply
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
   * Get app credit info.
   * @param {string} appId
   * @param {string} symbol
   * @returns
   */
  getAppCredit(appId: string, symbol: string): Promise<AppCreditInfo> {
    const query = {
      appId,
    };
    const trailingUrl = `symbol/${symbol}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Delete app credit.
   * @param {string} appId
   * @param {string} symbol
   * @returns
   */
  deleteAppCredit(appId: string, symbol: string): Promise<void> {
    const query = {
      appId,
    };
    const trailingUrl = `symbol/${symbol}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Mint app credit to user.
   * @param {string} appId
   * @param {string} symbol
   * @param {string} to
   * @param {number} amount
   * @param {object} payload
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
   * Burn credit app from user.
   * @param {string} appId
   * @param {string} symbol
   * @param {string} from
   * @param {number} amount
   * @param {object} payload
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
   * @param {string} appId
   * @param {string} symbol
   * @param {string} from
   * @param {string} to
   * @param {number} amount
   * @param {object} payload
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
   * @param {string} appId
   * @param {string} symbol
   * @param {string} userId
   * @param {string} chain
   * @param {number} amount
   * @param {string} userAddress
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
   * @param {string} appId
   * @param {string} symbol
   * @return {Promise<AppWithdrawList>} Return AppWithdrawList Object
   */
  getWithdrawList(appId: string, symbol: string): Promise<AppWithdrawList> {
    const query = { appId };
    const trailingUrl = `symbol/${symbol}/withdraw`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * You can get withdrawal list apllied by one user
   * @param {string} appId
   * @param {string} symbol
   * @param {string} userId
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
   * @param {string} appId
   * @param {string} symbol
   * @param {string} userId
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
   * @param {string} appId
   * @param {string} symbol
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
   * Reflect withdraws complete status to server after transfer tokens
   * @param {string} appId
   * @param {string} symbol
   * @param {WithdrawRequestList} requestList
   * @param {string} txHash Hash of transfer transaction
   */
  withdrawComplete(
    appId: string,
    symbol: string,
    requestList: WithdrawRequestList,
    txHash: string,
  ): Promise<void> {
    const body = { appId, requestList, txHash };
    const trailingUrl = `symbol/${symbol}/withdraw/complete`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Reject requested withdrawals.
   * @param {string} appId
   * @param {string} symbol
   * @param {withdrawRequestList} requestList
   * @param {string} reason
   */
  rejectWithdrawal(
    appId: string,
    symbol: string,
    requestList: string,
    reason: string,
  ): Promise<void> {
    const body = { appId, requestList, reason };
    const trailingUrl = `symbol/${symbol}/withdraw/reject`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
  

  /**
   * You can restrict the user to leave a certain amount of credit
   * @param {string} appId
   * @param {string} symbol
   * @param {string} userId
   * @param {number} amount
   * @param {number} endAt
   * @param {string} reason
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
   * Get's a user's lockup list.
   * @param {string} appId
   * @param {string} symbol
   * @param {string} userId
   * @returns
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
   * Reflect withdraws complete status to server after transfer tokens
   * @param {string} appId
   * @param {DepositTransaction} transaction
   */
  depositToken(appId: string, transaction: DepositTransaction): Promise<void> {
    const body = { appId, transaction };
    const trailingUrl = `deposit/transaction`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Get user's deposit history.
   * @param {string} appId
   * @param {string} userId
   * @param {string} chain
   * @returns {Promise<DepositHistory>} Return depositHistory list of user.
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
