import AinftJs from '../../src/ainft';
import AinizeAuth from '../../src/auth/ainizeAuth';

describe('Ainize Authentication', () => {
  it('should not login without initialization', async () => {
    const auth = AinizeAuth.getInstance();

    await expect(auth.login()).rejects.toThrow(
      'Authentication not initialized. Please call ainizeAuth.init() first.'
    );
  });

  it('should login after initialization', async () => {
    // NOTE(jiyoung): when initialize ainft, also initialize ainizeAuth.
    const ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
    const auth = AinizeAuth.getInstance();
    await auth.login();

    expect(auth.getIsLoggedIn()).toBe(true);
  });

  it('should logout after initialization', async () => {
    const auth = AinizeAuth.getInstance();
    await auth.logout();

    expect(auth.getIsLoggedIn()).toBe(false);
  });
});
