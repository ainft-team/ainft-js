import AinftBase from './ainftBase';
import {
    HttpMethod,
    AddNftSymbolParams,
    GetAppNftSymbolListParams,
    GetNftSymbolParams,
    RemoveNftSymbolParams,
    NftContractBySymbol,
    GetNftParams,
    NftToken,
    GetNftContractInfoParams,
    NftContractInfo,
    GetUserNftListParams,
    NftCollections,
    SetNftMetadataParams,
    NftMetadata
} from './types';

export default class Nft extends AinftBase {
  addNftSymbol({
    appId,
    chain,
    network,
    contractAddress,
    options,
  }: AddNftSymbolParams): Promise<NftContractBySymbol> {
    const body = { appId, chain, network, contractAddress, options };
    const trailingUrl = 'symbol';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getAppNftSymbolList({
    appId,
  }: GetAppNftSymbolListParams): Promise<string[]> {
    const query = { appId };
    const trailingUrl = 'symbol';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  removeNftSymbol({
    appId,
    symbol,
  }: RemoveNftSymbolParams): Promise<NftContractBySymbol> {
    const query = { appId };
    const trailingUrl = `symbol/${symbol}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  getNftSymbol({
    appId,
    symbol,
  }: GetNftSymbolParams): Promise<NftContractBySymbol> {
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'info';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getNft({
    appId,
    chain,
    network,
    contractAddress,
    tokenId,
  }: GetNftParams): Promise<NftToken> {
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `info/${chain}/${network}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getNftContractInfo({
    appId,
    chain,
    network,
    contractAddress,
  }: GetNftContractInfoParams): Promise<NftContractInfo> {
    const query = { appId, contractAddress };
    const trailingUrl = `info/${chain}/${network}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getUserNftList({
    appId,
    chain,
    network,
    userAddress,
    contractAddress,
    tokenId,
  }: GetUserNftListParams): Promise<NftCollections> {
    const query: any = {
      appId,
      ...contractAddress && { contractAddress },
      ...tokenId && { tokenId },
    };
    const trailingUrl = `info/${chain}/${network}/${userAddress}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  setNftMetadata({
    appId,
    chain,
    network,
    contractAddress,
    tokenId,
    metadata,
  }: SetNftMetadataParams): Promise<NftMetadata> {
    const body = { appId, metadata };
    const trailingUrl = `info/${chain}/${network}/${contractAddress}/${tokenId}/metadata`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
