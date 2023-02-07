import AinftJs from '../src/ainft';

describe("Status", () => {
  it("should return health", async () => {
    // TODO(hyeonwoong): remove dev api endpoint.
    const ainftJs = new AinftJs(
      'a'.repeat(64),
      'https://ainft-api-dev.ainetwork.ai',
      "https://testnet-api.ainetwork.ai", // TODO(lia): use an access key for testing,
      0
    );
    expect(await ainftJs.getStatus()).toMatchObject({ health: true });
  });
});
