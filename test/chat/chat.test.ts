import AinftJs from '../../src/ainft';

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

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const serviceName = 'ainize_openai';

describe('chat', () => {
  jest.setTimeout(60000); // 1min
  let ainft: AinftJs;

  beforeAll(() => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('config: should configure chat for ainft object', async () => {
    const result = await ainft.chat.configure(objectId, 'openai');
    const { config } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(config.name).toBe(serviceName);
    expect(config.type).toBe('chat');
  });

  it('credit: should get credit', async () => {
    const credit = await ainft.chat.getCredit('openai');

    expect(credit).toBe(null);
  });

  it('credit: should deposit credit', async () => {
    const result = await ainft.chat.depositCredit('openai', 10);

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.address).toBe('0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0');
    expect(result.balance).toBe(10);
  });
});
