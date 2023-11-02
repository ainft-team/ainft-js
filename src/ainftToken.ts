import Ain from "@ainblockchain/ain-js";
import FactoryBase from "./factoryBase";
import { HttpMethod } from "./types";

/**
 * The class of AINFT Token.
 */
export class AinftToken extends FactoryBase {
  /** The AINFT object ID of AINFT. */
  readonly ainftObjectId: string;
  /** The token ID of AINFT. */
  readonly tokenId: string;
  /** The metadata of AINFT. */
  readonly metadata?: object;
  /** The token URI of AINFT's metadata. */
  readonly tokenURI: string;

  /**
   * Create AinftToken instance.
   * Do not use it directly; use the Ainft721Object.getToken() function instead.
   * @param tokenInfo The information about the AINFT.
   * @param tokenInfo.ainftObjectId The AINFT object ID of AINFT.
   * @param tokenInfo.tokenId The token ID of AINFT.
   * @param tokenInfo.tokenURI The token URI of AINFT's metadata.
   * @param tokenInfo.metadata The metadata of AINFT.
   * @param ain Ain instance to sign and send transaction to AIN blockchain.
   * @param baseUrl The base url to request api to AINFT factory server.
   */
  constructor(tokenInfo: { ainftObjectId: string, tokenId: string, tokenURI: string, metadata?: object }, ain: Ain, baseUrl: string) {
    super(ain, baseUrl);
    this.ainftObjectId = tokenInfo.ainftObjectId;
    this.tokenId = tokenInfo.tokenId;
    this.tokenURI = tokenInfo.tokenURI;
    this.metadata = tokenInfo.metadata;
  }

  /**
   * Sets AINFT's metadata.
   * @param metadata The value to be set as metadata for the AINFT.
   * @returns Returns transaction result.
   * 
   * ```ts
   * import AinftJs from '@ainft-team/ainft-js';
   * 
   * const ainftJs = new AinftJs('YOUR-PRIVATE-KEY');
   * async function main() {
   *  const ainftObject = await ainftJs.nft.get('YOUR-AINFT-OBJECT-ID');
   *  const ainft = await ainftObject.getToken('YOUR-TOKEN-ID);
   *  const metadata = {
   *    image: '...',
   *  }
   *  const result = await ainft.setMetadata(metadata);
   *  console.log(result) // result of transaction.
   * }
   * ```
   */
  async setMetadata(metadata: object) { 
    const address = await this.ain.signer.getAddress();
    const body = { ainftObjectId: this.ainftObjectId, tokenId: this.tokenId, metadata, userAddress: address };
    const trailingUrl = `native/metadata`;
    const txBody = await this.sendRequestWithoutSign(HttpMethod.POST, trailingUrl, body);

    return this.ain.sendTransaction(txBody);
  }
}