import AinftJs from '../src/ainft';
import { test_private_key, test_object_id, test_token_id, test_thread_id } from './test_data';

jest.mock('../src/common/util', () => {
  const mockRequest = jest.fn((jobType, body) => {
    switch (jobType) {
      case 'create_thread':
      case 'modify_thread':
        return {
          ...body,
          id: test_thread_id,
          created_at: 0,
        };
      case 'retrieve_thread':
        return {
          id: test_thread_id,
          metadata: { key1: 'value1' },
          created_at: 0,
        };
      case 'delete_thread':
        return {
          id: test_thread_id,
          deleted: true,
        };
      default:
        return null;
    }
  });
  const util = jest.requireActual('../src/common/util');
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
    ainft = new AinftJs(test_private_key, {
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

    const res = await ainft.chat.thread.create(test_object_id, test_token_id, 'openai', body);

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.thread.id).toMatch(THREAD_PATTERN);
    expect(res.thread.metadata).toEqual({ key1: 'value1' });
  });

  it('should get thread', async () => {
    const thread = await ainft.chat.thread.get(
      test_thread_id,
      test_object_id,
      test_token_id,
      'openai'
    );

    expect(thread.id).toBe(test_thread_id);
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('should update thread', async () => {
    const body = { metadata: { key1: 'value1', key2: 'value2' } };

    const res = await ainft.chat.thread.update(
      test_thread_id,
      test_object_id,
      test_token_id,
      'openai',
      body
    );

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.thread.id).toBe(test_thread_id);
    expect(res.thread.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should delete thread', async () => {
    const res = await ainft.chat.thread.delete(
      test_thread_id,
      test_object_id,
      test_token_id,
      'openai'
    );

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.delThread.id).toBe(test_thread_id);
    expect(res.delThread.deleted).toBe(true);
  });
});
