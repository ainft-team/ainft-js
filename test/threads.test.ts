import AinftJs from '../src/ainft';
import * as util from '../src/common/util';

jest.mock('../../src/util', () => {
  const actual = jest.requireActual('../../src/util');
  return {
    ...actual,
    validateAssistant: jest.fn().mockResolvedValue(undefined),
    validateThread: jest.fn().mockResolvedValue(undefined),
    sendRequestToService: jest.fn(),
    sendTransaction: jest.fn().mockResolvedValue({
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
    }),
  };
});

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const tokenId = '1';
const threadId = 'thread_000000000000000000000001';

describe('thread', () => {
  jest.setTimeout(60000); // 1min
  let ainft: AinftJs;

  beforeAll(async () => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('create: should create thread', async () => {
    const body = {
      metadata: { key1: 'value1' },
    };

    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      ...body,
      id: threadId,
      created_at: 0,
    });

    const result = await ainft.chat.thread.create(objectId, tokenId, 'openai', body);
    const { thread } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(thread.id).toMatch(/^thread_[A-Za-z0-9]{24}/);
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('get: should get thread', async () => {
    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      id: threadId,
      metadata: { key1: 'value1' },
      created_at: 0,
    });

    const thread = await ainft.chat.thread.get(threadId, objectId, tokenId, 'openai');

    expect(thread.id).toBe(threadId);
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('update: should update thread', async () => {
    const body = {
      metadata: { key1: 'value1', key2: 'value2' },
    };

    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      ...body,
      id: threadId,
      created_at: 0,
    });

    const result = await ainft.chat.thread.update(threadId, objectId, tokenId, 'openai', body);
    const { thread } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(thread.id).toBe(threadId);
    expect(thread.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('delete: should delete thread', async () => {
    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      id: threadId,
      deleted: true,
    });

    const result = await ainft.chat.thread.delete(threadId, objectId, tokenId, 'openai');
    const { delThread } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(delThread.id).toBe(threadId);
    expect(delThread.deleted).toBe(true);
  });
});
