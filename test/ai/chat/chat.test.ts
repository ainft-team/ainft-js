import AinftJs from '../../../src/ainft';

jest.mock('../../../src/util', () => {
  const originalUtil = jest.requireActual('../../../src/util');
  return {
    ...originalUtil,
    validateAndGetService: jest.fn().mockResolvedValue({
      getCreditBalance: jest.fn().mockResolvedValue(0),
      chargeCredit: jest.fn().mockResolvedValue('0x' + 'a'.repeat(64)),
    }),
  };
});

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const appId = 'ainft721_0x8a193528f6d406ce81ff5d9a55304337d0ed8de6';
const serviceName = 'openai_ainize3';

describe('chat', () => {
  jest.setTimeout(60 * 1000);
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
    const txResult = await ainft.chat.configure(objectId, 'openai');

    const config = await ainft.ain.db.ref(`/apps/${appId}/ai/${serviceName}`).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(config.name).toBe(serviceName);
    expect(config.type).toBe('chat');
    expect(config.url).toBe(`https://${serviceName}.ainetwork.xyz`);
  });

  it('credit: should get credit', async () => {
    const credit = await ainft.chat.getCredit('openai');

    expect(credit).toBe(0);
  });

  // NOTE(jiyoung): integration test.
  // comment out mocks and update expected balance before test run.
  // it('credit: should deposit credit', async () => {
  //   const txResult = await ainft.chat.depositCredit('openai', 10);

  //   expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
  //   expect(txResult.address).toBe('0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0');
  //   expect(txResult.balance).toBe(10);
  // });
});
