import FactoryBase from './factoryBase';
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
  UploadAssetFromDataUrlParams,
  SearchOption,
  SearchReponse,
  AinftTokenSearch,
  AinftCollectionSearch,
} from './types';
import Ainft721 from './ainft721Object';
import stringify from 'fast-json-stable-stringify';
import {SUPPORTED_AINFT_STANDARDS} from "./constants";

export default class Nft extends FactoryBase {
  /**
   * Create NFT. Default standard is 721.
   * @param name NFT name
   * @param symbol NFT symbol
   * @param standard
   */
  async create(name: string, symbol: string) {
    const address = await this.ain.signer.getAddress();

    const body = { address, name, symbol };
    const trailingUrl = 'native';
    const { ainftObjectId, txBody, appId } = await this.sendRequest(HttpMethod.POST, trailingUrl, body);
    const txHash = await this.ain.sendTransaction(txBody);

    console.log(`AinftObject is created!`);
    console.log('ainft object ID: ', ainftObjectId);
    console.log('app ID: ', appId);
    console.log(`txHash: `, txHash);

    await this.register(ainftObjectId);
    return this.get(ainftObjectId);
  }

  /**
   * Register ainft object to factory server.
   * @param ainftObjectId 
   * @returns 
   */
  async register(ainftObjectId: string) {
    const address = await this.ain.signer.getAddress();
    const message = stringify({
      address,
      timestamp: Date.now(),
    });
    const signature = await this.ain.signer.signMessage(message, address);

    const body = { signature, message, ainftObjectId };
    const trailingUrl = 'native/register';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Return Ainft instance by ainftObjectId.
   * @param ainftObjectId
   */
  async get(ainftObjectId: string) {
    const { list } = await this.searchAinftObjects({ ainftObjectId });
    if (list.length === 0) {
      throw new Error(`Not found ainft`);
    }
    const nft = list[0];
    return new Ainft721({ id: nft.id, name: nft.name, symbol: nft.symbol, owner: nft.owner }, this.ain, this.baseUrl);
  }

  /**
   * Search ainftObjects created on the ain blockchain.
   * @returns
   * @param {NftSearchParams & SearchOption} searchParams
   */
  searchAinftObjects(searchParams: NftSearchParams & SearchOption): Promise<SearchReponse<AinftCollectionSearch>> {
    let query: Record<string, any> = {};
    if (searchParams) {
      const { userAddress, ainftObjectId, name, symbol, limit, offset } = searchParams;
      query = { userAddress, ainftObjectId, name, symbol, offset, limit };
    }
    const trailingUrl = `native/search/ainftObjects`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Search nfts on the ain blockchain.
   * @param {NftSearchParams & SearchOption} searchParams
   */
  searchNfts(searchParams: NftSearchParams & SearchOption): Promise<SearchReponse<AinftTokenSearch>> {
    let query: Record<string, any> = {};
    if (searchParams) {
      const { userAddress, ainftObjectId, name, symbol, limit, offset, tokenId } = searchParams;
      query = { userAddress, ainftObjectId, name, symbol, offset, limit, tokenId };
    }
    const trailingUrl = `native/search/nfts`;
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
