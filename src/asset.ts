import AinftBase from './ainftBase';
import { AppCreditInfo, HttpMethod, NftContractBySymbol, NftToken, NftContractInfo, NftCollections, NftMetadata, AppWithdrawList, UserWithdrawList, WithdrawRequestList } from './types';

  // TODO(kriii): Add network argument
export default class Asset extends AinftBase {
  addNftSymbol(
    appId: string,
    chain: string,
    contractAddress: string,
    options?: Record<string, any>
  ): Promise<NftContractBySymbol> {
    const body = { appId, chain, contractAddress, options }
    const trailingUrl = 'nft/symbol';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getAppNftSymbolList(appId: string): Promise<string[]> {
    const query = { appId };
    const trailingUrl = 'nft/symbol';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getNftContractBySymbol(appId: string, symbol: string): Promise<NftContractBySymbol> {
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'nft';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  removeNftSymbol(appId: string, symbol: string): Promise<NftContractBySymbol> {
    const query = { appId };
    const trailingUrl = `nft/symbol/${symbol}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  getNft(
    appId: string,
    chainId: string,
    contractAddress: string,
    tokenId: string,
  ): Promise<NftToken> {
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `nft/${chainId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getNftContractInfo(
    appId: string,
    chainId: string,
    contractAddress: string,
  ): Promise<NftContractInfo> {
    const query = { appId, contractAddress };
    const trailingUrl = `nft/${chainId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getUserNftList(
    appId: string,
    chainId: string,
    ethAddress: string,
    contractAddress?: string,
    tokenId?: string,
  ): Promise<NftCollections> {
    const query: any = {
      appId,
      ...contractAddress && { contractAddress },
      ...tokenId && { tokenId },
    };
    const trailingUrl = `nft/${chainId}/${ethAddress}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  setNftMetadata(
    appId: string,
    chain: string,
    network: string,
    contractAddress: string,
    tokenId: string,
    metadata: NftMetadata,
  ): Promise<NftMetadata> {
    const body = { appId, metadata };
    const trailingUrl = `nft/${chain}/${network}/${contractAddress}/${tokenId}/metadata`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

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
      ...maxSupply && { maxSupply },
    }
    const trailingUrl = 'credit';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getAppCredit(
    appId: string,
    symbol: string,
  ): Promise<AppCreditInfo> {
    const query = {
      appId,
    }
    const trailingUrl = `credit/${symbol}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  deleteAppCredit(
    appId: string,
    symbol: string,
  ): Promise<void> {
    const query = {
      appId,
    }
    const trailingUrl = `credit/${symbol}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  mintAppCredit(
    appId: string,
    symbol: string,
    to: string,
    amount: number,
    payload?: object,
  ): Promise<void> {
    const body = {
      appId,
      to,
      amount,
      ...payload && { payload },
    };
    const trailingUrl = `credit/${symbol}/mint`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  burnAppCredit(
    appId: string,
    symbol: string,
    from: string,
    amount: number,
    payload?: object,
  ): Promise<void> {
    const body = {
      appId,
      from,
      amount,
      ...payload && { payload },
    };
    const trailingUrl = `credit/${symbol}/burn`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  // NOTE(liayoo): calling this function will create a user if the recipient ('to') doesn't exist.
  transferAppCredit(
    appId: string,
    symbol: string,
    from: string,
    to: string,
    amount: number,
    payload?: object,
  ): Promise<void> {
    const body = {
      appId,
      from,
      to,
      amount,
      ...payload && { payload },
    };
    const trailingUrl = `credit/${symbol}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
  
  withdrawAppCredit(
    appId: string,
    symbol: string,
    userId: string,
    amount: number,
    userAddress: string,
  ): Promise<void> {
    const body = {
      appId,
      userId,
      amount,
      userAddress,
    };
    const trailingUrl = `credit/${symbol}/withdraw`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getWithdrawList(
    appId: string,
    symbol: string,
  ): Promise<AppWithdrawList> {
    const query = { appId };
    const trailingUrl = `credit/${symbol}/withdraw`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getWithdrawListByUserId(
    appId: string,
    symbol: string,
    userId: string,
  ): Promise<UserWithdrawList> {
    const query = { appId };
    const trailingUrl = `credit/${symbol}/withdraw/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getUserCreditBalance(
    appId: string,
    symbol: string,
    userId: string
  ): Promise<{ balance: number }> {
    const query = { appId };
    const trailingUrl = `credit/${symbol}/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  withdrawComplete(
    appId: string,
    symbol: string,
    requestList: WithdrawRequestList,
    txHash: string,
  ): Promise<void> {
    const body = { appId, requestList, txHash };
    const trailingUrl = `credit/${symbol}/withdraw/complete`;
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
    const trailingUrl = `credit/${symbol}/lockup`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
