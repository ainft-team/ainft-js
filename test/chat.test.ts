import AinftJs from '../src/ainft';
import { test_private_key, test_address, test_object_id, test_service_name } from './test_data';

jest.mock('../src/common/util', () => {
  const util = jest.requireActual('../src/common/util');
  return {
    ...util,
    ainizeLogin: jest.fn().mockResolvedValue(undefined),
    ainizeLogout: jest.fn().mockResolvedValue(undefined),
    validateAndGetService: jest.fn().mockResolvedValue({
      getCreditBalance: jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValue(10),
      chargeCredit: jest.fn().mockResolvedValue('0x' + 'a'.repeat(64)),
    }),
    sendTransaction: jest.fn().mockResolvedValue({
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
    }),
  };
});

const TX_PATTERN = /^0x([A-Fa-f0-9]{64})$/;

jest.setTimeout(60000);

describe.skip('chat', () => {
  let ainft: AinftJs;

  beforeAll(() => {
    ainft = new AinftJs(test_private_key, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should configure chat', async () => {
    const res = await ainft.chat.configure(test_object_id, 'openai');

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.config.name).toBe(test_service_name);
    expect(res.config.type).toBe('chat');
  });

  it('should get credit', async () => {
    const credit = await ainft.chat.getCredit('openai');

    expect(credit).toBe(null);
  });

  it('should deposit credit', async () => {
    const res = await ainft.chat.depositCredit('openai', 10);

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.address).toBe(test_address);
    expect(res.balance).toBe(10);
  });
});
