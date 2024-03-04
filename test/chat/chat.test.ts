import AinftJs from '../../src/ainft';
import { test_object_id, test_service_name } from '../test_data';

jest.mock('../../src/util', () => {
  const util = jest.requireActual('../../src/util');
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

const TEST_PK = 'f0a2599e5629d4e67266169ea9ad1999f86995418391175af6d66005c1e1d96c';
const TEST_ADDR = '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0';

jest.setTimeout(60000); // 1min

describe('chat', () => {
  let ainft: AinftJs;

  beforeAll(() => {
    ainft = new AinftJs(TEST_PK, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should configure chat', async () => {
    const result = await ainft.chat.configure(test_object_id, 'openai');
    const { config } = result;
    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(config.name).toBe(test_service_name);
    expect(config.type).toBe('chat');
  });

  it('should get credit', async () => {
    const credit = await ainft.chat.getCredit('openai');
    expect(credit).toBe(null);
  });

  it('should deposit credit', async () => {
    const result = await ainft.chat.depositCredit('openai', 10);
    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.address).toBe(TEST_ADDR);
    expect(result.balance).toBe(10);
  });
});
