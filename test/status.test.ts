import AinftJs from '../src/index';

describe("Status", () => {
  it("should return health", async () => {
    // TODO(hyeonwoong): remove dev api endpoint.
    const ainftJs = new AinftJs('https://ainft-api-dev.ainetwork.ai');
    expect(await ainftJs.getStatus()).toMatchObject({ health: true });
  });
});
