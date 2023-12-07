import AinftJs from "../src/ainft";
import Ainft721Object from "../src/ainft721Object";

describe("AI", () => {
  let ainftJs: AinftJs;
  let ainftObject: Ainft721Object;

  function initAinftJs(privateKey: string): AinftJs {
    const config = {
      ainftServerEndpoint: "https://ainft-api-dev.ainetwork.ai",
      ainBlockchainEndpoint: "https://testnet-api.ainetwork.ai",
      chainId: 0,
    };
    return new AinftJs(privateKey, config);
  }

  async function createAinftObject(
    name: string,
    symbol: string
  ): Promise<Ainft721Object> {
    const result = await ainftJs.nft.create(name, symbol);
    return result.ainftObject;
  }

  function setWriteRule(appId: string): Promise<any> {
    return ainftJs.ain.db.ref().setRule({
      ref: `/apps/${appId}/ai/$serviceName`,
      value: {
        ".rule": {
          write:
            "!!getValue('/apps/' + $serviceName) && util.isString(newData.status) && (newData.status === 'CONNECTED' || newData.status === 'DISCONNECTED')",
        },
      },
    });
  }

  function isDate(timestamp: number): boolean {
    return !isNaN(new Date(timestamp).getTime());
  }

  beforeAll(async () => {
    const privateKey =
      "f0a2599e5629d4e67266169ea9ad1999f86995418391175af6d66005c1e1d96c";
    ainftJs = initAinftJs(privateKey);
    ainftObject = await createAinftObject("name", "symbol");
    // NOTE(jiyoung): uncomment to reuse existing ainft object.
    // ainftObject = new Ainft721Object(
    //   {
    //     id: "0x29b87a6435f06a0a0B0A50Db837199f43cfbAE2F",
    //     name: "name",
    //     symbol: "symbol",
    //     owner: "0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0",
    //   },
    //   ainftJs.ain,
    //   "https://ainft-api-dev.ainetwork.ai"
    // );
    await setWriteRule(ainftObject.appId);
  });

  it("should create ainft object", () => {
    expect(ainftObject.id).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(ainftObject.name).toBe("name");
    expect(ainftObject.symbol).toBe("symbol");
    expect(ainftObject.owner).toBe(
      "0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0"
    );
    expect(ainftObject.appId).toMatch(/^ainft721_0x[a-f0-9]{40}$/); // lowercase
  });

  it("should set write rule", async () => {
    const appId = ainftObject.appId;
    const rule = await ainftJs.ain.db.ref(`/apps/${appId}`).getRule();
    expect(rule).toMatchObject({
      ".rule": {
        "write": `auth.addr === '${ainftObject.owner}'`,
      },
      "ai": {
        "$serviceName": {
          ".rule": {
            "write":
              "!!getValue('/apps/' + $serviceName) && util.isString(newData.status) && (newData.status === 'CONNECTED' || newData.status === 'DISCONNECTED')",
          },
        },
      },
    });
  });

  it("should send transaction to connect", async () => {
    const serviceName = "ainize_test14";
    await ainftJs.ai.connect(ainftObject, serviceName);
    const { status, timestamp } = await ainftJs.ain.db
      .ref(`/apps/${ainftObject.appId}/ai/${serviceName}`)
      .getValue();
    expect(status).toBe("CONNECTED");
    expect(isDate(timestamp)).toBe(true);
  });

  it("should send transaction to disconnect", async () => {
    const serviceName = "ainize_test14";
    await ainftJs.ai.disconnect(ainftObject, serviceName);
    const { status, timestamp } = await ainftJs.ain.db
      .ref(`/apps/${ainftObject.appId}/ai/${serviceName}`)
      .getValue();
    expect(status).toBe("DISCONNECTED");
    expect(isDate(timestamp)).toBe(true);
  });
});
