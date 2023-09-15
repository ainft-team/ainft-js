import { AinftToken } from "./ainftToken";
import FactoryBase from "./factoryBase";
import { HttpMethod } from "./types";
import Ain from "@ainblockchain/ain-js";

interface IAinft721 {
  transfer(from: string, to: string, tokenId: string): Promise<any>;
  mint(to: string, tokenId: string): Promise<any>;
}

export default class Ainft721 extends FactoryBase implements IAinft721 {
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

  async get(tokenId: string) {
    const { list } = await this.sendRequestWithoutSign(HttpMethod.GET, `native/search`, { nftId: this.id, tokenId });
    if (list.length === 0) {
      throw new Error('Not found token');
    }
    const token = list[0];
    return new AinftToken({ nftId: this.id, tokenId, tokenURI: token.tokenURI, metadata: token.metadata }, this.ain, this.baseUrl);
  }

  async transfer(from: string, to: string, tokenId: string): Promise<any> {
    const txbody  = await this.getTxBodyForTransfer(from, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  async mint(to: string, tokenId: string): Promise<any> {
    const address = await this.ain.signer.getAddress();
    const txbody = await this.getTxBodyForMint(address, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  getTxBodyForTransfer(from: string, to: string, tokenId: string) {
    const body = {
      address: from,
      toAddress: to,
    }
    const trailingUrl = `native/${this.id}/${tokenId}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

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