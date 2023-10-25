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
export default class Eth extends FactoryBase {
  private chain = 'ETH';

  /**
   * Adds NFT symbol. You can add NFT to reference in your factory app.
   * @param {AddNftSymbolParams} AddNftSymbolParams The parameters to add NFT symbol.
   * @returns
   */
  addNftSymbol({
    appId,
    network,
    contractAddress,
    options,
  }: AddNftSymbolParams): Promise<NftContractBySymbol> {
    const body = { appId, chain: this.chain, network, contractAddress, options };
    const trailingUrl = 'symbol';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets NFT symbol list in app.
   * @param {GetAppNftSymbolListParams} GetAppNftSymbolListParams The parameters to get NFT symbol list in app.
   * @returns Returns a list of symbols registered in the app.
   */
  getAppNftSymbolList({ appId }: GetAppNftSymbolListParams): Promise<string[]> {
    const query = { appId };
    const trailingUrl = 'symbol';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Removes NFT symbol from app.
   * @param {RemoveNftSymbolParams} RemoveNftSymbolParams The parameters to remove NFT symbol from app.
   * @returns Returns removed contract information.
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
   * Gets NFT contract info by symbol.
   * @param {GetNftSymbolParams} GetNftSymbolParams The parameters to get contract by symbol.
   * @returns Returns contract information by symbol.
   */
  getContractInfoBySymbol({
    appId,
    symbol,
  }: GetNftSymbolParams): Promise<NftContractBySymbol> {
    const query = { appId, symbol: encodeURIComponent(symbol) };
    const trailingUrl = 'info';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Gets NFT info by network, contractAddress and tokenId.
   * Symbol must be added.
   * @param {GetNftParams} GetNftParams The parameters to get NFT information.
   * @returns Returns NFT information.
   */
  getNft({
    appId,
    network,
    contractAddress,
    tokenId,
  }: GetNftParams): Promise<NftToken> {
    const query = { appId, contractAddress, tokenId };
    const trailingUrl = `info/${this.chain}/${network}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Gets contract info by network and contractAddress.
   * Symbol must be added.
   * @param {GetNftContractInfoParams} GetNftContractInfoParams The parameters to get contract information.
   * @returns Returns contract information.
   */
  getNftContractInfo({
    appId,
    network,
    contractAddress,
  }: GetNftContractInfoParams): Promise<NftContractInfo> {
    const query = { appId, contractAddress };
    const trailingUrl = `info/${this.chain}/${network}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get nft list in the collection.
   * @param {GetNftsInCollectionParams} GetNftsInCollectionParams
   * @returns Returns a map of NFTs distinguished by their token IDs.
   */
  getNftsInCollection({
    network,
    collectionId,
    appId
  }: GetNftsInCollectionParams): Promise<NftTokens> {
    const query: any = {
      appId,
    };
    const trailingUrl = `info/${this.chain}/${network}/collections/${collectionId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Gets NFT list by user address.
   * @param {GetUserNftListParams} GetUserNftListParams The parameters to get NFT list user owned.
   * @returns Returns NFTs owned by the user along with their contract information.
   */
  getUserNftList({
    appId,
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
    const trailingUrl = `info/${this.chain}/${network}/${userAddress}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Sets managed NFT metadata.
   * @param {SetEthNftMetadataParams} SetNftMetadataParams The parameters to set NFT metadata.
   * @returns Returns set metadata.
   */
  async setNftMetadata({
    appId,
    network,
    contractAddress,
    tokenId,
    metadata,
  }: SetEthNftMetadataParams): Promise<NftMetadata> {
    const body = { appId, metadata };
    const trailingUrl = `info/${this.chain}/${network}/${contractAddress}/${tokenId}/metadata`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}