import Ain from "@ainblockchain/ain-js";
import AinftBase from "./ainftBase";
import { HttpMethod } from "./types";
import { Signer } from "./signer";

interface IAinft721 {
  transfer(from: string, to: string, tokenId: string): Promise<any>;
  mint(to: string, tokenId: string): Promise<string>;
}

export default class Ainft721 extends AinftBase implements IAinft721 {
  readonly name: string;
  readonly symbol: string;
  readonly id: string;
  private chain = 'AIN';
  private network: string;

  constructor(id: string, name: string, symbol: string, ain: Ain, signer: Signer, baseUrl: string,) {
    super(ain, signer, baseUrl);
    this.id = id;
    this.name = name;
    this.symbol = symbol;

    if (ain.chainId === 0) {
      this.network = 'testnet';
    } else if (ain.chainId === 1) {
      this.network = 'mainnet';
    } else {
      throw new Error('Ainft721 constructor: Invalid ChainId');
    }
  }

  async transfer(from: string, to: string, tokenId: string): Promise<string> {
    const txbody  = await this.getTxBodyForTransfer(from, to, tokenId);
    return this.signer.sendTransaction(txbody);
  }

  async mint(to: string, tokenId: string): Promise<string> {
    const address = await this.signer.getAddress();
    const txbody = await this.getTxBodyForMint(address, to, tokenId);
    return this.signer.sendTransaction(txbody);
  }

  private getTxBodyForTransfer(from: string, to: string, tokenId: string) {
    const body = {
      address: from,
      toAddress: to,
    }
    const trailingUrl = `native/${this.name}/${this.chain}/${this.network}/${this.name}/${tokenId}/transfer`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  private getTxBodyForMint(ownerAddress: string, to: string, tokenId: string) {
    const body = {
      address: ownerAddress,
      toAddress: to,
      tokenId,
    }
    const trailingUrl = `native/${this.name}/${this.chain}/${this.network}/${this.name}/mint`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}