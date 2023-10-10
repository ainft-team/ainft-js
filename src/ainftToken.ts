import Ain from "@ainblockchain/ain-js";
import FactoryBase from "./factoryBase";
import { HttpMethod } from "./types";

/**
 * The class of AINFT Token.
 */
export class AinftToken extends FactoryBase {
  readonly ainftObjectId: string;
  readonly tokenId: string;
  readonly metadata?: object;
  readonly tokenURI: string;

  constructor(tokenInfo: { ainftObjectId: string, tokenId: string, tokenURI: string, metadata?: object }, ain: Ain, baseUrl: string) {
    super(ain, baseUrl);
    this.ainftObjectId = tokenInfo.ainftObjectId;
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
    const body = { ainftObjectId: this.ainftObjectId, tokenId: this.tokenId, metadata, userAddress: address };
    const trailingUrl = `native/metadata`;
    const txBody = await this.sendRequestWithoutSign(HttpMethod.POST, trailingUrl, body);

    return this.ain.sendTransaction(txBody);
  }
}