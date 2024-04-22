import AinftJs from '../src/ainft';

describe('Status', () => {
  it('should return health', async () => {
    // TODO(hyeonwoong): remove dev api endpoint.
    const config = {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    };
    const ainftJs = new AinftJs('a'.repeat(64), null, config);
    expect(await ainftJs.getStatus()).toMatchObject({ health: true });
  });
});
