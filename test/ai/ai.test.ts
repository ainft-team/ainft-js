import AinftJs from '../../src/ainft';
import { privateKey, address, objectId, serviceName } from '../test_data';
import { TX_HASH_REGEX } from '../constants';

describe.skip('chat', () => {
  let ainft: AinftJs;

  beforeAll(async () => {
    ainft = new AinftJs({
      privateKey,
      baseUrl: 'https://ainft-api-dev.ainetwork.ai',
      blockchainUrl: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
    await ainft.connect();
  });

  afterAll(async () => {
    await ainft.disconnect();
  });

  it('should configure ai', async () => {
    const result = await ainft.ai.configure(objectId, serviceName);

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.config).toEqual({ name: serviceName });
  });

  it('should get credit', async () => {
    const credit = await ainft.ai.getCredit(serviceName);

    expect(credit).toBe(null);
  });

  // NOTE(jiyoung): deposit is disabled until withdrawal is implemented.
  // it('should deposit credit', async () => {
  //   const result = await ainft.ai.depositCredit(serviceName, 10);

  //   expect(result.tx_hash).toMatch(TX_HASH_REGEX);
  //   expect(result.address).toBe(address);
  //   expect(result.balance).toBe(10);
  // });

  it('should all tokens with status', async () => {
    const result = await ainft.ai.getUserTokensByStatus(objectId, address);

    expect(result.total).toBeDefined();
    expect(result.items).toBeDefined();
  });
});
