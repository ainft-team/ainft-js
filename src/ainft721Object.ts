import { AinftToken } from "./ainftToken";
import FactoryBase from "./factoryBase";
import { HttpMethod } from "./types";
import Ain from "@ainblockchain/ain-js";

/**
 * The class of AINFT 721.
 */
export default class Ainft721Object extends FactoryBase {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly owner: string;

  constructor(nftInfo: { id: string, name: string, symbol: string, owner: string}, ain: Ain, baseUrl: string) {
    super(ain, baseUrl);
    this.id = nftInfo.id;
    this.name = nftInfo.name;
    this.symbol = nftInfo.symbol;
    this.owner = nftInfo.owner;
  }

  /**
   * Get specific token object.
   * @param tokenId
   * @returns 
   */
  async get(tokenId: string) {
    const { list } = await this.sendRequestWithoutSign(HttpMethod.GET, `native/search/nfts`, { ainftObjectId: this.id, tokenId });
    if (list.length === 0) {
      throw new Error('Not found token');
    }
    const token = list[0];
    return new AinftToken({ ainftObjectId: this.id, tokenId, tokenURI: token.tokenURI, metadata: token.metadata }, this.ain, this.baseUrl);
  }

  /**
   * Transfer token to others.
   * @param from 
   * @param to 
   * @param tokenId 
   * @returns 
   */
  async transfer(from: string, to: string, tokenId: string): Promise<any> {
    const txbody  = await this.getTxBodyForTransfer(from, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  /**
   * Mint new token.
   * @param to 
   * @param tokenId 
   * @returns 
   */
  async mint(to: string, tokenId: string): Promise<any> {
    const address = await this.ain.signer.getAddress();
    const txbody = await this.getTxBodyForMint(address, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  /**
   * Get txBody to transfer token.
   * @param from 
   * @param to 
   * @param tokenId 
   * @returns 
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
   * Get txBody to mint token.
   * @param ownerAddress 
   * @param to 
   * @param tokenId 
   * @returns 
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
}