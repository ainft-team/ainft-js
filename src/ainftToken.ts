import Ain from "@ainblockchain/ain-js";
import FactoryBase from "./factoryBase";
import { HttpMethod } from "./types";

/**
 * The class of AINFT Token.
 */
export class AinftToken extends FactoryBase {
  readonly nftId: string;
  readonly tokenId: string;
  readonly metadata?: object;
  readonly tokenURI: string;

  constructor(tokenInfo: {nftId: string, tokenId: string, tokenURI: string, metadata?: object}, ain: Ain, baseUrl: string) {
    super(ain, baseUrl);
    this.nftId = tokenInfo.nftId;
    this.tokenId = tokenInfo.tokenId;
    this.tokenURI = tokenInfo.tokenURI;
    this.metadata = tokenInfo.metadata;
  }

  /**
   * Set token's metadata.
   * @param metadata 
   * @returns 
   */
  async setMetadata(metadata: object) { 
    const address = await this.ain.signer.getAddress();
    const body = { nftId: this.nftId, tokenId: this.tokenId, metadata, userAddress: address };
    const trailingUrl = `native/metadata`;
    const txBody = await this.sendRequestWithoutSign(HttpMethod.POST, trailingUrl, body);

    return this.ain.sendTransaction(txBody);
  }
}