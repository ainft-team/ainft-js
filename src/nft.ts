import AinftBase from './ainftBase';
import {
  AddNftSymbolParams,
  DeleteAssetParams,
  GetAppNftSymbolListParams,
  GetNftContractInfoParams,
  GetNftParams,
  GetNftsInAinCollectionParams,
  GetNftsInCollectionParams,
  GetNftsInEthContractParams,
  GetNftSymbolParams,
  getTxBodySetNftMetadataParams,
  GetUserNftListParams,
  HttpMethod,
  NftCollections,
  NftContractBySymbol,
  NftContractInfo,
  NftMetadata,
  NftToken,
  NftTokens,
  RemoveNftSymbolParams,
  NftSearchParams,
  SetAinNftMetadataParams,
  SetEthNftMetadataParams,
  SetNftMetadataParams,
  UploadAssetFromBufferParams,
  UploadAssetFromDataUrlParams, SearchOption
} from './types';
import Ainft721 from './ainft721';
import stringify from 'fast-json-stable-stringify';

export default class Nft extends AinftBase {

  private isSupportedStandard(standard: string) {
    return standard === '721';
  }

  /**
   * Create NFT. Default standard is 721.
   * @param name NFT name
   * @param symbol NFT symbol
   */
  async create(name: string, symbol: string, standard = '721') {
    if (!this.isSupportedStandard(standard)) {
      throw Error('Nft create: Not supported standard.');
    }
    const address = this.ain.signer.getAddress();

    const body = { address, name, symbol, standard };
    const trailingUrl = 'native';
    const { nftId, txBody, appId } = await this.sendRequest(HttpMethod.POST, trailingUrl, body);
    const txHash = await this.ain.sendTransaction(txBody);

    console.log('nft ID: ', nftId);
    console.log('app ID: ', appId);

    await this.register(nftId);

    return new Ainft721(nftId, this.ain, this.baseUrl);
  }

  /**
   * Register nft to factory server.
   * @param nftId 
   * @returns 
   */
  async register(nftId: string) {
    const address = this.ain.signer.getAddress();
    const message = stringify({
      address,
      timestamp: Date.now(),
    });
    const signature = await this.ain.signer.signMessage(message, address);

    const body = { signature, message, nftId };
    const trailingUrl = 'native/register';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Return Ainft721 instance by nftId.
   * @param nftId
   */
  getAinft721(nftId: string) {
    return new Ainft721(nftId, this.ain, this.baseUrl);
  }

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
  }: GetNftsInEthContractParams): Promise<NftTokens>
  getNftsInCollection({
    chain,
    network,
    collectionId,
    appId,
  }: GetNftsInAinCollectionParams): Promise<NftTokens> // FIXME(ehgmsdk20): Define type for AINFTs
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
    nftId,
    tokenId,
    metadata,
  }: SetAinNftMetadataParams): Promise<any>;
  async setNftMetadata({
    appId,
    chain,
    network,
    contractAddress,
    tokenId,
    metadata,
  }: SetEthNftMetadataParams): Promise<NftMetadata>;
  async setNftMetadata({
    appId,
    chain,
    network,
    contractAddress,
    tokenId,
    metadata,
    nftId,
  }: SetNftMetadataParams): Promise<NftMetadata | any> {
    if (chain === 'ETH') {
      const body = { appId, metadata };
      const trailingUrl = `info/${chain}/${network}/${contractAddress}/${tokenId}/metadata`;
      return this.sendRequest(HttpMethod.POST, trailingUrl, body);
    } else {
      const address = this.ain.signer.getAddress();
      const txBody = await this.getTxBodyForSetNftMetadata({
        nftId,
        tokenId,
        metadata,
        userAddress: address
      });
      return this.ain.sendTransaction(txBody);
    }
  }

  /**
   * Get transaction body to set nft metadata in ain blockchain.
   * Currently, only support AIN chain.
   * @param {getTxBodySetNftMetadataParams} getTxBodySetNftMetadataParams
   * @returns
   */
  private getTxBodyForSetNftMetadata({
    nftId,
    tokenId,
    metadata,
    userAddress,
  }: getTxBodySetNftMetadataParams) {
    const body = { nftId, tokenId, metadata, userAddress };
    const trailingUrl = `native/metadata`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Search nfts created on the ain blockchain.
   * @returns
   * @param {NftSearchParams & SearchOption} searchParams
   */
  searchCollection(searchParams: NftSearchParams & SearchOption): Promise<NftToken[]> {
    let query: Record<string, any> = {};
    if (searchParams) {
      const { userAddress, nftId, name, symbol, limit, offset } = searchParams;
      query = { userAddress, nftId, name, symbol, offset, limit };
    }
    const trailingUrl = `native/search/collections`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Search nft assets on the ain blockchain.
   * @param {NftSearchParams & SearchOption} searchParams
   */
  searchAssets(searchParams: NftSearchParams & SearchOption) {
    let query: Record<string, any> = {};
    if (searchParams) {
      const { userAddress, nftId, name, symbol, limit, offset, tokenId } = searchParams;
      query = { userAddress, nftId, name, symbol, offset, limit, tokenId };
    }
    const trailingUrl = `native/search/assets`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Upload the asset file using the buffer.
   * @param {UploadAssetFromBufferParams} UploadAssetFromBufferParams 
   * @returns {Promise<string>} Return the asset url.
   */
  uploadAsset({
    appId,
    buffer,
    filePath
  }: UploadAssetFromBufferParams): Promise<string> {
    const trailingUrl = `asset/${appId}`;
    return this.sendFormRequest(HttpMethod.POST, trailingUrl, {
      appId,
      filePath
    }, {
      asset: {
        filename: filePath,
        buffer
      }
    });
  }

  /**
   * Upload the asset file using the data url.
   * @param {UploadAssetFromDataUrlParams} UploadAssetFromDataUrlParams 
   * @returns {Promise<string>} Return the asset url.
   */
  uploadAssetWithDataUrl({
    appId,
    dataUrl,
    filePath
  }: UploadAssetFromDataUrlParams): Promise<string> {
    const body = {
      appId,
      dataUrl,
      filePath
    };
    const trailingUrl = `asset/${appId}`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Delete the asset you uploaded.
   * @param {DeleteAssetParams} DeleteAssetParams 
   */
  deleteAsset({
    appId,
    filePath
  }: DeleteAssetParams): Promise<void> {
    const encodeFilePath = encodeURIComponent(filePath)
    const trailingUrl = `asset/${appId}/${encodeFilePath}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl);
  }
}
