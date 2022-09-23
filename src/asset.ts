import AinftBase from './ainftBase';
import { AppCreditInfo, HttpMethod, NftContract, NftToken, UserNfts } from './types';

export default class Asset extends AinftBase {
  getAppNftSymbolList(appId: string): Promise<string[]> {
    const query = { appId };
    const trailingUrl = 'nft/symbol';
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }

  getNftContractBySymbol(appId: string, symbol: string): Promise<NftContract> {
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'nft';
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }

  getNft(
    appId: string,
    chainId: string,
    contractAddress: string,
    tokenId: string,
  ): Promise<NftToken> {
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `nft/${chainId}`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl)
  }

  getUserNftList(
    appId: string,
    chainId: string,
    ethAddress: string,
    contractAddress?: string,
    tokenId?: string,
  ): Promise<UserNfts> {
    const query: any = {
      appId,
      ...contractAddress && { contractAddress },
      ...tokenId && { tokenId },
    };
    const trailingUrl = `nft/${chainId}/${ethAddress}`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
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
    return this.sendRequest(HttpMethod.POST, body, trailingUrl);
  }

  getAppCredit(
    appId: string,
    symbol: string,
  ): Promise<AppCreditInfo> {
    const query = {
      appId,
    }
    const trailingUrl = `credit/${symbol}`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }

  deleteAppCredit(
    appId: string,
    symbol: string,
  ): Promise<void> {
    const query = {
      appId,
    }
    const trailingUrl = `credit/${symbol}`;
    return this.sendRequest(HttpMethod.DELETE, query, trailingUrl);
  }

  mintAppCredit(
    appId: string,
    symbol: string,
    to: string,
    amount: number,
  ): Promise<void> {
    const body = {
      appId,
      to,
      amount
    };
    const trailingUrl = `credit/${symbol}/mint`;
    return this.sendRequest(HttpMethod.POST, body, trailingUrl);
  }

  burnAppCredit(
    appId: string,
    symbol: string,
    from: string,
    amount: number,
  ): Promise<void> {
    const body = {
      appId,
      from,
      amount
    };
    const trailingUrl = `credit/${symbol}/burn`;
    return this.sendRequest(HttpMethod.POST, body, trailingUrl);
  }

  transferAppCredit(
    appId: string,
    symbol: string,
    from: string,
    to: string,
    amount: number,
  ): Promise<void> {
    const body = {
      appId,
      from,
      to,
      amount
    };
    const trailingUrl = `credit/${symbol}/transfer`;
    return this.sendRequest(HttpMethod.POST, body, trailingUrl);
  }

  getUserCreditBalance(
    appId: string,
    symbol: string,
    userId: string
  ): Promise<{ balance: number }> {
    const query = { appId };
    const trailingUrl = `credit/${symbol}/${userId}`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }
}
