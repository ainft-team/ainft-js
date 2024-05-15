import AinftJs from '../src/ainft';

describe('status', () => {
  it('should return health', async () => {
    const ainft = new AinftJs({
      privateKey: 'a'.repeat(64),
      baseUrl: 'https://ainft-api-dev.ainetwork.ai',
      blockchainUrl: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });

    expect(await ainft.getStatus()).toMatchObject({ health: true });
  });
});
