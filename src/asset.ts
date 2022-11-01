import AinftBase from './ainftBase';
import { AppCreditInfo, HttpMethod, NftContractBySymbol, NftToken, NftCollections, UserNftsOld } from './types';

export default class Asset extends AinftBase {
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

  getNft(
    appId: string,
    chainId: string,
    contractAddress: string,
    tokenId: string,
  ): Promise<NftToken> {
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `nft/${chainId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query)
  }

  getUserNftList(
    appId: string,
    chainId: string,
    ethAddress: string,
    contractAddress?: string,
    tokenId?: string,
    includeContractInfo: boolean = false,
  ): Promise<NftCollections|UserNftsOld> {
    const query: any = {
      appId,
      ...contractAddress && { contractAddress },
      ...tokenId && { tokenId },
      includeContractInfo: includeContractInfo.toString(),
    };
    const trailingUrl = `nft/${chainId}/${ethAddress}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
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

  getUserCreditBalance(
    appId: string,
    symbol: string,
    userId: string
  ): Promise<{ balance: number }> {
    const query = { appId };
    const trailingUrl = `credit/${symbol}/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
