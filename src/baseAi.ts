import Ain from "@ainblockchain/ain-js";
import Ainize from "@ainize-team/ainize-sdk";
import Ainft721Object from "./ainft721Object";
import { BlockchainPathMap, buildSetTransactionBody } from "./util";
import { TransactionResult } from "./types";

export default class BaseAi {
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  async config(
    ainftObjectId: string,
    aiName: string
  ): Promise<TransactionResult> {
    const appId = Ainft721Object.getAppId(ainftObjectId);
    const appPath = BlockchainPathMap.app(appId).root();
    const app = await this.ain.db.ref(appPath).getValue();
    if (!app) {
      throw new Error("AINFT object not found");
    }

    const address = this.ain.signer.getAddress();
    if (address !== app.owner) {
      throw new Error(`${address} is not AINFT object owner`);
    }

    const service = await this.ainize!.getService(aiName); // aiName == serviceName
    // TODO(jiyoung): update to process service.isRunning() boolean return when implemented.
    await service.isRunning();

    // TODO(jiyoung): switch to using service.getInformation() when implemented.
    const txBody = buildSetTransactionBody({
      type: "SET_VALUE",
      ref: `/apps/${appId}/ai/${aiName}`,
      value: {
        name: aiName,
        url: `https://${aiName}.ainetwork.xyz`,
      },
    });
    const result = await this.ain.sendTransaction(txBody);
    return { txHash: result.tx_hash };
  }

  getStatus(): void {}

  calculateCost(): void {}
  chargeCredit(): void {}
  withdrawCredit(): void {}
  getCreditBalance(): void {}
  getCreditHistory(): void {}

  request(): void {}
}
