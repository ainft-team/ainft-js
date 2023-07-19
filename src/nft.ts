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
    UploadAssetFromDataUrlParams,
    UploadAssetFromBufferParams,
    DeleteAssetParams,
    getTxBodyCreateNftCollectionParams,
    getTxBodyMintNftParams,
    getTxBodyTransferNftParams,
    getTxBodySetNftMetadataParams
} from './types';

export default class Nft extends AinftBase {
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
   * You must enter collectionId or contractAddress. If both are entered, the collectionId is used.
   * @param {SetNftMetadataParams} SetNftMetadataParams
   * @returns
   */
  async setNftMetadata({
    appId,
    chain,
    network,
    collectionId,
    contractAddress,
    tokenId,
    metadata,
  }: SetNftMetadataParams): Promise<NftMetadata> {
    const _collectionId = collectionId || contractAddress;
    if (chain === 'AIN') {
      const txBody = await this.getTxBodyForSetNftMetadata({
        appId,
        chain,
        network,
        collectionId: _collectionId,
        tokenId,
        metadata,
        ownerAddress: this.ain.wallet.defaultAccount?.address!,
      });
      return this.ain.sendTransaction(txBody);
    } else {
      const body = { appId, metadata };
      const trailingUrl = `info/${chain}/${network}/${_collectionId}/${tokenId}/metadata`;
      return this.sendRequest(HttpMethod.POST, trailingUrl, body);
    }
  }

  /**
   * Get transaction body to set nft metadata in ain blockchain.
   * Currently, only support AIN chain.
   * @param {getTxBodySetNftMetadataParams} getTxBodySetNftMetadataParams
   * @returns
   */
  getTxBodyForSetNftMetadata({
    appId,
    chain,
    network,
    collectionId,
    tokenId,
    metadata,
    ownerAddress,
  }: getTxBodySetNftMetadataParams) {
    const body = { appId, metadata, ownerAddress };
    const trailingUrl = `info/${chain}/${network}/${collectionId}/${tokenId}/metadata`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Create nft collection in ain blockchain. You can modify metadata setting permission through tokenUpdatePermission.
   * @param {CreateNftCollectionParams} CreateNftCollectionParams
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
   * @param {MintNftParams} MintNftParams
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
   * @param {SearchNftOption} SearchNftOption
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
   * @param {TransferNftParams} TransferNftParams
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
   * @param {getTxBodyCreateNftCollectionParams} getTxBodyCreateNftCollectionParams
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
   * @param {getTxBodyMintNftParams} getTxBodyMintNftParams
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
   * @param {getTxBodyTransferNftParams} getTxBodyTransferNftParams
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

  /**
   * Upload the asset file using the buffer.
   * @param {UploadAssetFromBufferParams} UploadAssetFromBufferParams
   * @returns {Promise<string>} Return the asset url.
   */
  uploadAsset({
    appId,
    buffer,
    filePath,
  }: UploadAssetFromBufferParams): Promise<string> {
    const trailingUrl = `asset/${appId}`;
    return this.sendFormRequest(
      HttpMethod.POST,
      trailingUrl,
      {
        appId,
        filePath,
      },
      {
        asset: {
          filename: filePath,
          buffer,
        },
      }
    );
  }

  /**
   * Upload the asset file using the data url.
   * @param {UploadAssetFromDataUrlParams} UploadAssetFromDataUrlParams
   * @returns {Promise<string>} Return the asset url.
   */
  uploadAssetWithDataUrl({
    appId,
    dataUrl,
    filePath,
  }: UploadAssetFromDataUrlParams): Promise<string> {
    const body = {
      appId,
      dataUrl,
      filePath,
    };
    const trailingUrl = `asset/${appId}`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Delete the asset you uploaded.
   * @param {DeleteAssetParams} DeleteAssetParams
   */
  deleteAsset({ appId, filePath }: DeleteAssetParams): Promise<void> {
    const encodeFilePath = encodeURIComponent(filePath);
    const trailingUrl = `asset/${appId}/${encodeFilePath}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl);
  }
}
