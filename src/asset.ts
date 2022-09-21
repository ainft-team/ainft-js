import AinftBase from './ainftBase';
import { AppCreditInfo, HttpMethod, NftContract, NftToken, UserNfts } from './types';

const prefix = 'asset';
export default class Asset extends AinftBase {
  async getNftContractBySymbol(appId: string, symbol: string) {
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'nft';
    const nftContract = (await this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query)) as NftContract;
    return nftContract;
  }

  async getNft(
    appId: string,
    chainId: string,
    contractAddress: string,
    tokenId: string,
  ) {
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `nft/${chainId}`;
    const nftToken = (await this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query)) as NftToken;
    return nftToken;
  }

  async getUserNftList(
    appId: string,
    chainId: string,
    ethAddress: string,
    contractAddress?: string,
    tokenId?: string,
  ) {
    const query: any = {
      appId,
      ...contractAddress && { contractAddress },
      ...tokenId && { tokenId },
    };
    const trailingUrl = `nft/${chainId}/${ethAddress}`;
    const userNfts = (await this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query)) as UserNfts;

    return userNfts;
  }

  async createAppCredit(
    appId: string,
    symbol: string,
    name: string,
    maxSupply?: number
  ) {
    const body = {
      appId,
      symbol,
      name,
      ...maxSupply && { maxSupply },
    }
    const trailingUrl = 'credit';
    const appCreditInfo = (await this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body)) as AppCreditInfo;
    return appCreditInfo;
  }

  async getAppCredit(
    appId: string,
    symbol: string,
  ) {
    const query = {
      appId,
    }
    const trailingUrl = `credit/${symbol}`;
    const appCreditInfo = (await this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query)) as AppCreditInfo;
    return appCreditInfo;
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

  async getUserCreditBalance(appId: string, symbol: string, userId: string) {
    const query = { appId };
    const trailingUrl = `credit/${symbol}/${userId}`;
    const balance = await this.sendRequest(HttpMethod.POST, prefix, trailingUrl, query) as { balance: number };
    return balance;
  }
}
