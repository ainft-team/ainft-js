import AinftJs from '../../src/ainft';
import { privateKey, objectId, tokenId, threadId } from '../test_data';

jest.mock('../src/utils/util', () => {
  const mockRequest = jest.fn((jobType, body) => {
    switch (jobType) {
      case 'create_thread':
      case 'modify_thread':
        return {
          ...body,
          id: threadId,
          created_at: 0,
        };
      case 'retrieve_thread':
        return {
          id: threadId,
          metadata: { key1: 'value1' },
          created_at: 0,
        };
      case 'delete_thread':
        return {
          id: threadId,
          deleted: true,
        };
      default:
        return null;
    }
  });
  const util = jest.requireActual('../src/utils/util');
  return {
    ...util,
    validateAssistant: jest.fn().mockResolvedValue(undefined),
    validateThread: jest.fn().mockResolvedValue(undefined),
    sendAinizeRequest: mockRequest,
    sendTransaction: jest.fn().mockResolvedValue({
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
    }),
  };
});

const TX_PATTERN = /^0x([A-Fa-f0-9]{64})$/;
const THREAD_PATTERN = /^thread_([A-Za-z0-9]{24})$/;

jest.setTimeout(60000);

describe('thread', () => {
  let ainft: AinftJs;

  beforeAll(async () => {
    ainft = new AinftJs(privateKey, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should create thread', async () => {
    const body = { metadata: { key1: 'value1' } };

    const res = await ainft.chat.thread.create(objectId, tokenId, 'openai', body);

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.thread.id).toMatch(THREAD_PATTERN);
    expect(res.thread.metadata).toEqual({ key1: 'value1' });
  });

  it('should get thread', async () => {
    const thread = await ainft.chat.thread.get(threadId, objectId, tokenId, 'openai');

    expect(thread.id).toBe(threadId);
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('should get thread list', async () => {
    const result = await ainft.chat.thread.list(objectId, tokenId, 'openai', {
      offset: 0,
      limit: 20,
      order: 'desc',
    });
    console.log(JSON.stringify(result, null, 4));
  });

  it('should update thread', async () => {
    const body = { metadata: { key1: 'value1', key2: 'value2' } };

    const res = await ainft.chat.thread.update(threadId, objectId, tokenId, 'openai', body);

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.thread.id).toBe(threadId);
    expect(res.thread.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should delete thread', async () => {
    const res = await ainft.chat.thread.delete(threadId, objectId, tokenId, 'openai');

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.delThread.id).toBe(threadId);
    expect(res.delThread.deleted).toBe(true);
  });

  it('should create thread and send message', async () => {
    const result = await ainft.chat.thread.createAndSend(objectId, tokenId, 'openai', {
      message: { role: 'user', content: '안녕하세요' },
    });
    console.log(JSON.stringify(result, null, 4));
  });
});
