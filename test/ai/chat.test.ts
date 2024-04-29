import AinftJs from '../../src/ainft';
import { privateKey, address, objectId, nickname } from '../test_data';
import { TX_HASH_REGEX } from '../constants';

describe.skip('chat', () => {
  let ainft: AinftJs;

  beforeEach(() => {
    ainft = new AinftJs(privateKey, null, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should configure chat', async () => {
    const result = await ainft.chat.configure(objectId, nickname);

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.config.name).toBe(nickname);
    expect(result.config.type).toBe('chat');
  });

  it('should get credit', async () => {
    const credit = await ainft.chat.getCredit(nickname);

    expect(credit).toBe(null);
  });

  // NOTE(jiyoung): deposit is disabled until withdrawal is ready.
  // it('should deposit credit', async () => {
  //   const result = await ainft.chat.depositCredit('openai', 10);

  //   expect(result.tx_hash).toMatch(TX_HASH_REGEX);
  //   expect(result.address).toBe(address);
  //   expect(result.balance).toBe(10);
  // });
});
