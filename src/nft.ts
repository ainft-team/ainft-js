import FactoryBase from './factoryBase';
import {
  DeleteAssetParams,
  HttpMethod,
  NftSearchParams,
  UploadAssetFromBufferParams,
  UploadAssetFromDataUrlParams,
  AinftTokenSearchResponse,
  AinftObjectSearchResponse,
} from './types';
import Ainft721Object from './ainft721Object';
import stringify from 'fast-json-stable-stringify';

export default class Nft extends FactoryBase {
  /**
   * Create AINFT object.
   * @param name The name of AINFT object.
   * @param symbol The symbol of AINFT object.
   * @returns The generated AINFT object.
   */
  async create(name: string, symbol: string): Promise<Ainft721Object> {
    const address = await this.ain.signer.getAddress();

    const body = { address, name, symbol };
    const trailingUrl = 'native';
    const { ainftObjectId, txBody, appId } = await this.sendRequest(HttpMethod.POST, trailingUrl, body);
    const txHash = await this.ain.sendTransaction(txBody);

    console.log(`AinftObject is created!`);
    console.log('AINFT object ID: ', ainftObjectId);
    console.log('app ID: ', appId);
    console.log(`txHash: `, txHash);

    await this.register(ainftObjectId);
    return this.get(ainftObjectId);
  }

  /**
   * Register AINFT object to factory server.
   * @param ainftObjectId The ID of AINFT object.
   * @returns There is no return value.
   */
  async register(ainftObjectId: string): Promise<void> {
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
   * Get AINFT object instance by ainftObjectId.
   * @param ainftObjectId The ID of AINFT object.
   * @returns Returns the AINFT object corresponding to the given ID.
   */
  async get(ainftObjectId: string) {
    const { ainftObjects } = await this.searchAinftObjects({ ainftObjectId });
    if (ainftObjects.length === 0) {
      throw new Error(`Not found ainft`);
    }
    const ainftObject = ainftObjects[0];
    return new Ainft721Object(ainftObject, this.ain, this.baseUrl);
  }

  /**
   * Get AINFTs by AINFT object id.
   * @param ainftObjectId - The ID of AINFT object.
   * @param limit - Sets the maximum number of NFTs to retrieve.
   * @param cursor - Optional cursor to use for pagination.
   * @returns Returns AINFTs.
   */
  async getAinftsByAinftObject(ainftObjectId: string, limit?: number, cursor?: string): Promise<AinftTokenSearchResponse> {
    return this.searchNfts({ ainftObjectId, limit, cursor });
  }

  /**
   * Get AINFTs by user address.
   * @param address - The ID of AINFT object.
   * @param limit - Sets the maximum number of NFTs to retrieve.
   * @param cursor - Optional cursor to use for pagination.
   * @returns Returns AINFTs.
   */
  async getAinftsByAccount(address: string, limit?: number, cursor?: string): Promise<AinftTokenSearchResponse> {
    return this.searchNfts({ userAddress: address, limit, cursor });
  }

  /**
   * Searches for AINFT objects created on the AIN Blockchain.
   * @param {NftSearchParams} searchParams The parameters to search AINFT object.
   * @returns Returns searched AINFT objects.
   */
  searchAinftObjects(searchParams: NftSearchParams): Promise<AinftObjectSearchResponse> {
    let query: Record<string, any> = {};
    if (searchParams) {
      const { userAddress, ainftObjectId, name, symbol, limit, cursor } = searchParams;
      query = { userAddress, ainftObjectId, name, symbol, cursor, limit };
    }
    const trailingUrl = `native/search/ainftObjects`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Searches for AINFTs on the ain blockchain.
   * @param {NftSearchParams} searchParams The parameters to search AINFT.
   * @returns Returns searched AINFTs
   */
  searchNfts(searchParams: NftSearchParams): Promise<AinftTokenSearchResponse> {
    let query: Record<string, any> = {};
    if (searchParams) {
      const { userAddress, ainftObjectId, name, symbol, limit, cursor, tokenId } = searchParams;
      query = { userAddress, ainftObjectId, name, symbol, cursor, limit, tokenId };
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
