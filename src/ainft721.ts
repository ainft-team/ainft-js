import AinftBase from "./ainftBase";
import { HttpMethod } from "./types";
import { Signer } from "./signer";
import { AINFT_SERVER_ENDPOINT } from "./constants";
import Ain from "@ainblockchain/ain-js";

interface IAinft721 {
  transfer(from: string, to: string, tokenId: string): Promise<any>;
  mint(to: string, tokenId: string): Promise<string>;
}

export default class Ainft721 extends AinftBase implements IAinft721 {
  readonly id: string;

  constructor(id: string, ain: Ain, baseUrl: string) {
    super(ain, baseUrl);
    this.id = id;
  }

  async transfer(from: string, to: string, tokenId: string): Promise<string> {
    const txbody  = await this.getTxBodyForTransfer(from, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  async mint(to: string, tokenId: string): Promise<string> {
    // TODO: this.ain.signer.getAddress();
    const address = this.ain.wallet.defaultAccount?.address!;
    const txbody = await this.getTxBodyForMint(address, to, tokenId);
    return this.ain.sendTransaction(txbody);
  }

  private getTxBodyForTransfer(from: string, to: string, tokenId: string) {
    const body = {
      address: from,
      toAddress: to,
    }
    const trailingUrl = `nft/native/${this.id}/${tokenId}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  private getTxBodyForMint(ownerAddress: string, to: string, tokenId: string) {
    const body = {
      address: ownerAddress,
      toAddress: to,
      tokenId,
    }
    const trailingUrl = `nft/native/${this.id}/mint`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}