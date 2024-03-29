import { AinftToken } from "./ainftToken";
import FactoryBase from "./factoryBase";
import { HttpMethod } from "./types";
import Ain from "@ainblockchain/ain-js";

/**
 * The class of AINFT 721 object.
 */
export default class Ainft721Object extends FactoryBase {
  /** The ID of AINFT object. */
  readonly id: string;
  /** The name of AINFT object. */
  readonly name: string;
  /** The symbol of AINFT object. */
  readonly symbol: string;
  /** Owner of AINFT object. */
  readonly owner: string;
  /** The ID of app in AIN blockchain. */
  readonly appId: string;

  /**
   * Constructor of Ainft721Object.
   * Do not use it directly; use the nft.get() function instead.
   * @param objectInfo The information about the AINFT object.
   * @param objectInfo.id The ID of AINFT object.
   * @param objectInfo.name The name of AINFT object.
   * @param objectInfo.symbol The symbol of AINFT object.
   * @param objectInfo.owner Owner of AINFT object.
   * @param ain Ain instance to sign and send transaction to AIN blockchain.
   * @param baseUrl The base url to request api to AINFT factory server.
   */
  constructor(objectInfo: { id: string, name: string, symbol: string, owner: string}, ain: Ain, baseUrl: string) {
    super(ain, baseUrl);
    this.id = objectInfo.id;
    this.name = objectInfo.name;
    this.symbol = objectInfo.symbol;
    this.owner = objectInfo.owner;
    this.appId = Ainft721Object.getAppId(objectInfo.id);
  }

  /**
   * Gets specific token object.
   * @param tokenId Token ID of AINFT.
   * @returns Returns AINFT token instance.
   * ```ts
   * import AinftJs from '@ainft-team/ainft-js';
   * 
   * const ainftJs = new AinftJs('YOUR-PRIVATE-KEY');
   * async function main() {
   *  const ainftObject = await ainftJs.nft.get('YOUR-AINFT-OBJECT-ID');
   *  const ainft = await ainftObject.getToken('YOUR-TOKEN-ID);
   * }
   * ```
   */
  async getToken(tokenId: string): Promise<AinftToken> {
    const { nfts } = await this.sendRequestWithoutSign(HttpMethod.GET, `native/search/nfts`, { ainftObjectId: this.id, tokenId });
    if (nfts.length === 0) {
      throw new Error('Token not found');
    }
    const token = nfts[0];
    return new AinftToken({ ainftObjectId: this.id, tokenId, tokenURI: token.tokenURI, metadata: token.metadata }, this.ain, this.baseUrl);
  }

  /**
   * Transfers token to other account.
   * @param from The address the AINFT will be send from.
   * @param to 	The address the AINFT will be send to.
   * @param tokenId Token ID of AINFT.
   * @returns Returns transaction result.
   * 
   * ```ts
   * import AinftJs from '@ainft-team/ainft-js';
   * 
   * const ainftJs = new AinftJs('YOUR-PRIVATE-KEY');
   * async function main() {
   *  const ainftObject = await ainftJs.nft.get('YOUR-AINFT-OBJECT-ID');
   *  const result = await ainftObject.transfer('SENDER-ADDRESS', 'RECEIVER-ADDRESS', 'TARGET-TOKEN-ID');
   *  console.log(result); // result of transaction.
   * }
   * ```
   */
  async transfer(from: string, to: string, tokenId: string): Promise<any> {
    const txbody  = await this.getTxBodyForTransfer(from, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  /**
   * Mints new token.
   * @param to The address the AINFT will be minted.
   * @param tokenId Token ID of AINFT.
   * @returns Returns transaction result.
   * ```ts
   * import AinftJs from '@ainft-team/ainft-js';
   * 
   * const ainftJs = new AinftJs('YOUR-PRIVATE-KEY');
   * async function main() {
   *  const ainftObject = await ainftJs.nft.get('YOUR-AINFT-OBJECT-ID');
   *  const result = await ainftObject.mint('RECEIVER-ADDRESS', 'TARGET-TOKEN-ID');
   *  console.log(result); // result of transaction.
   * }
   * ```
   */
  async mint(to: string, tokenId: string): Promise<any> {
    const address = await this.ain.signer.getAddress();
    const txbody = await this.getTxBodyForMint(address, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  /**
   * Gets transaction body to transfer token.
   * @param from The address the AINFT will be send from.
   * @param to The address the AINFT will be send to.
   * @param tokenId Token ID of AINFT.
   * @returns Returns transaction body without signature.
   * 
   * ```ts
   * import AinftJs from '@ainft-team/ainft-js';
   * 
   * const ainftJs = new AinftJs('YOUR-PRIVATE-KEY');
   * async function main() {
   *  const ainftObject = await ainftJs.nft.get('YOUR-AINFT-OBJECT-ID');
   *  const result = await ainftObject.getTxBodyForTransfer('SENDER-ADDRESS', 'RECEIVER-ADDRESS', 'TARGET-TOKEN-ID');
   *  console.log(result); // trasacntion body for transfer.
   * }
   * ```
   */
  getTxBodyForTransfer(from: string, to: string, tokenId: string) {
    const body = {
      address: from,
      toAddress: to,
    }
    const trailingUrl = `native/${this.id}/${tokenId}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets transaction body to mint token.
   * @param ownerAddress The address of the AINFT object owner.
   * @param to The address the AINFT will be send.
   * @param tokenId Token ID of AINFT.
   * @returns Returns transaction body without signature.
   * 
   * ```ts
   * import AinftJs from '@ainft-team/ainft-js';
   * 
   * const ainftJs = new AinftJs('YOUR-PRIVATE-KEY');
   * async function main() {
   *  const ainftObject = await ainftJs.nft.get('YOUR-AINFT-OBJECT-ID');
   *  const result = await ainftObject.getTxBodyForMint('RECEIVER-ADDRESS', 'TARGET-TOKEN-ID');
   *  console.log(result); // trasacntion body for mint.
   * }
   * ```
   */
  getTxBodyForMint(ownerAddress: string, to: string, tokenId: string) {
    const body = {
      address: ownerAddress,
      toAddress: to,
      tokenId,
    }
    const trailingUrl = `native/${this.id}/mint`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets app ID by AINFT object ID.
   * @param id 
   */
  static getAppId(id: string): string {
    return `ainft721_${id.toLowerCase()}`;
  }
}