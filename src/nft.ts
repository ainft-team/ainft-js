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
    TransferNftParams,
    getTxBodyCreateNftCollectionParams,
    getTxBodyMintNftParams,
    getTxBodyTransferNftParams,
    getTxBodySetNftMetadataParams
} from './types';

export default class Nft extends AinftBase {
  /**
   * Add nfy symbol. You can add nft to reference in your factory activity.
   * @param param0
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
   * @param param0
   * @returns
   */
  getAppNftSymbolList({ appId }: GetAppNftSymbolListParams): Promise<string[]> {
    const query = { appId };
    const trailingUrl = 'symbol';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Remove nft symbol in app.
   * @param param0
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
   * @param param0
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
   * @param param0
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
   * @param param0
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
   * Get nft list by user address.
   * @param param0
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
   * @param param0
   * @returns
   */
  async setNftMetadata({
    appId,
    chain,
    network,
    contractAddress,
    tokenId,
    metadata,
  }: SetNftMetadataParams): Promise<NftMetadata> {
    if (chain === 'AIN') {
      const txBody = await this.getTxBodyForSetNftMetadata({
        appId,
        chain,
        network,
        contractAddress,
        tokenId,
        metadata,
        ownerAddress: this.ain.wallet.defaultAccount?.address!,
      });
      return this.ain.sendTransaction(txBody);
    } else {
      const body = { appId, metadata };
      const trailingUrl = `info/${chain}/${network}/${contractAddress}/${tokenId}/metadata`;
      return this.sendRequest(HttpMethod.POST, trailingUrl, body);
    }
  }

  /**
   * Get transaction body to set nft metadata in ain blockchain.
   * Currently, only support AIN chain.
   * @param param0
   * @returns
   */
  getTxBodyForSetNftMetadata({
    appId,
    chain,
    network,
    contractAddress,
    tokenId,
    metadata,
    ownerAddress,
  }: getTxBodySetNftMetadataParams) {
    const body = { appId, metadata, ownerAddress };
    const trailingUrl = `info/${chain}/${network}/${contractAddress}/${tokenId}/metadata`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Create nft collection in ain blockchain. You can modify metadata setting permission through tokenUpdatePermission.
   * @param param0
   * @returns
   */
  async createNftCollection({
    chain,
    network,
    appId,
    collectionId,
    symbol,
    name,
    connectWhitelist,
    tokenUpdatePermission,
  }: CreateNftCollectionParams) {
    const txBody = await this.getTxBodyForCreateNftCollection({
      address: this.ain.wallet.defaultAccount?.address!,
      chain,
      network,
      appId,
      collectionId,
      symbol,
      name,
      connectWhitelist,
      tokenUpdatePermission,
    });
    return this.ain.sendTransaction(txBody);
  }

  /**
   * Mint the nft of the created collection.
   * @param param0
   * @returns
   */
  async mintNft({
    chain,
    network,
    appId,
    collectionId,
    metadata,
    toAddress,
    tokenId,
  }: MintNftParams) {
    const txBody = await this.getTxBodyForMintNft({
      address: this.ain.wallet.defaultAccount?.address!,
      chain,
      network,
      appId,
      collectionId,
      metadata,
      toAddress,
      tokenId,
    });
    return this.ain.sendTransaction(txBody);
  }

  /**
   * Search nfts created on the ain blockchain. You can use user address, collectionId, and appId as search filters.
   * @param param0
   * @returns
   */
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

  /**
   * Transfer nft created on the ain blockchain to others.
   * @param param0
   * @returns
   */
  async transferNft({
    chain,
    network,
    appId,
    collectionId,
    tokenId,
    toAddress,
  }: TransferNftParams) {
    const txBody = await this.getTxBodyForTransferNft({
      address: this.ain.wallet.defaultAccount?.address!,
      chain,
      network,
      appId,
      collectionId,
      tokenId,
      toAddress,
    });
    return this.ain.sendTransaction(txBody);
  }

  /**
   * Get transaction body to create nft collection. Sending the transaction must be done manually.
   * @param param0
   * @returns
   */
  getTxBodyForCreateNftCollection({
    address,
    chain,
    network,
    appId,
    collectionId,
    symbol,
    name,
    connectWhitelist,
    tokenUpdatePermission,
  }: getTxBodyCreateNftCollectionParams): Promise<TransactionInput> {
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

  /**
   * Get transaction body to mint nft. Sending the transaction must be done manually.
   * @param param0
   * @returns
   */
  getTxBodyForMintNft({
    address,
    chain,
    network,
    appId,
    collectionId,
    metadata,
    toAddress,
    tokenId,
  }: getTxBodyMintNftParams): Promise<TransactionInput> {
    const body = {
      address,
      metadata,
      toAddress,
      tokenId,
    };
    const trailingUrl = `native/${appId}/${chain}/${network}/${collectionId}/mint`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Get transaction body to transfer nft. Sending the transaction must be done manually.
   * @param param0
   * @returns
   */
  getTxBodyForTransferNft({
    address,
    chain,
    network,
    appId,
    collectionId,
    tokenId,
    toAddress,
  }: getTxBodyTransferNftParams): Promise<TransactionInput> {
    const body = {
      address,
      toAddress,
    };
    const trailingUrl = `native/${appId}/${chain}/${network}/${collectionId}/${tokenId}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
