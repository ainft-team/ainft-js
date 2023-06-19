import { TransactionInput } from '@ainblockchain/ain-js/lib/types';
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
    NftMetadata,
    CreateNftCollectionParams,
    MintNftParams,
    SearchNftOption,
    TransferNftParams
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

  getAppNftSymbolList({ appId }: GetAppNftSymbolListParams): Promise<string[]> {
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
      ...(contractAddress && { contractAddress }),
      ...(tokenId && { tokenId }),
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

  createNftCollection({
    address,
    chain,
    network,
    appId,
    collectionId,
    symbol,
    name,
    connectWhitelist,
    tokenUpdatePermission
  }: CreateNftCollectionParams): Promise<TransactionInput> {
    const body = {
      address,
      collectionId,
      symbol,
      name,
      connectWhitelist,
      tokenUpdatePermission,
    };
    const trailingUrl = `native/${appId}/${chain}/${network}/collection`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  mintNft({
    address,
    chain,
    network,
    appId,
    collectionId,
    metadata,
    toAddress,
    tokenId,
  }: MintNftParams): Promise<TransactionInput> {
    const body = {
      address,
      metadata,
      toAddress,
      tokenId,
    };
    const trailingUrl = `native/${appId}/${chain}/${network}/${collectionId}/mint`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  searchNft({
    address,
    appId,
    collectionId,
    chain,
    network,
  }: SearchNftOption): Promise<NftToken[]> {
    const query = { address, appId, collectionId, chain, network };
    const trailingUrl = `native/search`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  transferNft({
    address,
    chain,
    network,
    appId,
    collectionId,
    tokenId,
    toAddress,
  }: TransferNftParams): Promise<TransactionInput> {
    const body = {
      address,
      toAddress,
    };
    const trailingUrl = `native/${appId}/${chain}/${network}/${collectionId}/${tokenId}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
