import AinftBase from './ainftBase';
import { AppCreditInfo, HttpMethod, NftContract, NftToken, UserNfts } from './types';

const prefix = 'asset';
export default class Asset extends AinftBase {
  getNftContractBySymbol(appId: string, symbol: string): Promise<NftContract> {
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'nft';
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  getNft(
    appId: string,
    chainId: string,
    contractAddress: string,
    tokenId: string,
  ): Promise<NftToken> {
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `nft/${chainId}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query)
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
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
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
    return this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  getAppCredit(
    appId: string,
    symbol: string,
  ): Promise<AppCreditInfo> {
    const query = {
      appId,
    }
    const trailingUrl = `credit/${symbol}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  async deleteAppCredit(
    appId: string,
    symbol: string,
  ) {
    const query = {
      appId,
    }
    const trailingUrl = `credit/${symbol}`;
    await this.sendRequest(HttpMethod.DELETE, prefix, trailingUrl, query);
  }

  async mintAppCredit(
    appId: string,
    symbol: string,
    to: string,
    amount: number,
  ) {
    const body = {
      appId,
      to,
      amount
    };
    const trailingUrl = `credit/${symbol}/mint`;
    await this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  async burnAppCredit(
    appId: string,
    symbol: string,
    from: string,
    amount: number,
  ) {
    const body = {
      appId,
      from,
      amount
    };
    const trailingUrl = `credit/${symbol}/burn`;
    await this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  async transferAppCredit(
    appId: string,
    symbol: string,
    from: string,
    to: string,
    amount: number,
  ) {
    const body = {
      appId,
      from,
      to,
      amount
    };
    const trailingUrl = `credit/${symbol}/transfer`;
    await this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  getUserCreditBalance(
    appId: string,
    symbol: string,
    userId: string
  ): Promise<{ balance: number }> {
    const query = { appId };
    const trailingUrl = `credit/${symbol}/${userId}`;
    return this.sendRequest(HttpMethod.POST, prefix, trailingUrl, query);
  }
}
