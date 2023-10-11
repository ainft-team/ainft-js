import FactoryBase from "./factoryBase";
import {
  AddNftSymbolParams,
  GetAppNftSymbolListParams,
  GetNftContractInfoParams,
  GetNftParams,
  GetNftSymbolParams,
  GetNftsInCollectionParams,
  GetUserNftListParams,
  HttpMethod,
  NftCollections,
  NftContractBySymbol,
  NftContractInfo,
  NftMetadata,
  NftToken,
  NftTokens,
  RemoveNftSymbolParams,
  SetEthNftMetadataParams
} from "./types";

/**
 * This class allows app to register and manage ETH Contracts. This allows you to enrich tokenomics.
 */
class Eth extends FactoryBase {
  /**
   * Add nfy symbol. You can add nft to reference in your factory activity.
   * @param {AddNftSymbolParams} AddNftSymbolParams
   * @returns
   */
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

  /**
   * Get nft symbol list in app.
   * @param {GetAppNftSymbolListParams} GetAppNftSymbolListParams
   * @returns
   */
  getAppNftSymbolList({ appId }: GetAppNftSymbolListParams): Promise<string[]> {
    const query = { appId };
    const trailingUrl = 'symbol';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Remove nft symbol in app.
   * @param {RemoveNftSymbolParams} RemoveNftSymbolParams
   * @returns
   */
  removeNftSymbol({
    appId,
    symbol,
  }: RemoveNftSymbolParams): Promise<NftContractBySymbol> {
    const query = { appId };
    const trailingUrl = `symbol/${symbol}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Get nft contract info by symbol.
   * @param {GetNftSymbolParams} GetNftSymbolParams
   * @returns
   */
  getNftSymbol({
    appId,
    symbol,
  }: GetNftSymbolParams): Promise<NftContractBySymbol> {
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'info';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get nft info by chain, network, contractAddress and tokenId.
   * Symbol must be added.
   * @param {GetNftParams} GetNftParams
   * @returns
   */
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

  /**
   * Get nft contract info by chain, network and contractAddress.
   * Symbol must be added
   * @param {GetNftContractInfoParams} GetNftContractInfoParams
   * @returns
   */
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

  /**
   * Get nft list in the collection.
   * @param {GetNftsInCollectionParams} GetNftsInCollectionParams
   * @returns
   */
  getNftsInCollection({
    chain,
    network,
    collectionId,
    appId
  }: GetNftsInCollectionParams): Promise<NftTokens> {
    const query: any = {
      appId,
    };
    const trailingUrl = `info/${chain}/${network}/collections/${collectionId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get nft list by user address.
   * @param {GetUserNftListParams} GetUserNftListParams
   * @returns
   */
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

  /**
   * Set managed nft metadata. If the chain is AIN, the transaction must be sent to the ain blockchain. Please set an appropriate privateKey.
   * @param {SetNftMetadataParams} SetNftMetadataParams
   * @returns
   */
  async setNftMetadata({
    appId,
    chain,
    network,
    contractAddress,
    tokenId,
    metadata,
  }: SetEthNftMetadataParams): Promise<NftMetadata> {
    const body = { appId, metadata };
    const trailingUrl = `info/${chain}/${network}/${contractAddress}/${tokenId}/metadata`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}