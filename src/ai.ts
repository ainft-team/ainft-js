import Ain from "@ainblockchain/ain-js";
import Ainize from "@ainize-team/ainize-sdk";

export default class AI {
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  connect(): void {}
  disconnect(): void {}

  getStatus(): void {}

  calculateCost(): void {}
  chargeCredit(): void {}
  withdrawCredit(): void {}
  getCreditBalance(): void {}
  getCreditHistory(): void {}

  request(): void {}
}
