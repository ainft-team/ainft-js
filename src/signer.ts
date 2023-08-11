import Ain from "@ainblockchain/ain-js";
import { TransactionInput } from "@ainblockchain/ain-js/lib/types";

export interface Signer {
  getAddress(): Promise<string> | string;
  signMessage(message:string): Promise<string> | string;
  sendTransaction(transaction: TransactionInput): Promise<string>;
}

export class DefaultSigner implements Signer {
  private ain: Ain;
  constructor(ain: Ain) {
    this.ain = ain;
  }

  getAddress(): string {
    const account = this.ain.wallet.defaultAccount;
    if (!account) throw Error("Default Signer: Default account does not exist.");
    return account.address;
  }
  signMessage(message: string): string {
    const address = this.getAddress();
    return this.ain.wallet.sign(message, address);
  }
  async sendTransaction(transaction: TransactionInput): Promise<string> {
    const res = await this.ain.sendTransaction(transaction);
    if (!res) throw Error("Default Signer: Does not receive transaction reseponse.");
    return res.tx_hash;
  }
}