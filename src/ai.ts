import Ain from "@ainblockchain/ain-js";
import Ainize from "@ainize-team/ainize-sdk";
import Ainft721Object from "./ainft721Object";
import { Path } from "./constants";
import { AiConnectionStatus } from "./types";
import { buildTransactionBody } from "./util";

export default class AI {
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  async connect(
    ainftObject: Ainft721Object,
    serviceName: string
  ): Promise<any> {
    const appId = ainftObject.appId;
    const appPath = Path.app(appId).root();
    const app = await this.ain.db.ref(appPath).getValue();
    if (!app) {
      throw new Error("AINFT object not found");
    }

    const address = this.ain.signer.getAddress();
    if (address !== app.owner) {
      throw new Error(`Not AINFT object owner: ${address}`);
    }

    const service = await this.ainize!.getService(serviceName);
    // TODO(jiyoung): update to handle boolean return from service.isRunning() when implemented.
    await service.isRunning();

    const txBody = buildTransactionBody({
      type: "SET_VALUE",
      ref: `/apps/${appId}/ai/${serviceName}`,
      value: {
        status: AiConnectionStatus.CONNECTED,
        timestamp: Date.now(),
      },
    });
    return this.ain.sendTransaction(txBody);
  }

  async disconnect(
    ainftObject: Ainft721Object,
    serviceName: string
  ): Promise<any> {
    const appId = ainftObject.appId;
    const appPath = Path.app(appId).root();
    const app = await this.ain.db.ref(appPath).getValue();
    if (!app) {
      throw new Error("AINFT object not found");
    }

    const address = this.ain.signer.getAddress();
    if (address !== app.owner) {
      throw new Error(`Not AINFT object owner: ${address}`);
    }

    const connectionStatusPath = Path.app(appId).connectionStatus(serviceName);
    const connectionStatus = await this.ain.db
      .ref(connectionStatusPath)
      .getValue();
    if (
      !connectionStatus ||
      connectionStatus !== AiConnectionStatus.CONNECTED
    ) {
      throw new Error(`AINFT object not connected to service`);
    }

    const txBody = buildTransactionBody({
      type: "SET_VALUE",
      ref: `/apps/${appId}/ai/${serviceName}`,
      value: {
        status: AiConnectionStatus.DISCONNECTED,
        timestamp: Date.now(),
      },
    });
    return this.ain.sendTransaction(txBody);
  }

  getStatus(): void {}

  calculateCost(): void {}
  chargeCredit(): void {}
  withdrawCredit(): void {}
  getCreditBalance(): void {}
  getCreditHistory(): void {}

  request(): void {}
}
