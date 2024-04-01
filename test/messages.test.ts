import AinftJs from '../src/ainft';
import { MessageCreateParams } from '../src/types';
import { messageId, objectId, privateKey, threadId, tokenId } from './test_data';

jest.mock('../src/common/util', () => {
  const mockRequest = jest.fn((jobType) => {
    switch (jobType) {
      case 'create_message':
        return Promise.resolve({ status: 'SUCCESS', data: {} });
      case 'retrieve_message':
        return Promise.resolve({
          status: 'SUCCESS',
          data: {
            id: 'msg_000000000000000000000001',
            created_at: 1707360317,
            thread_id: 'thread_000000000000000000000001',
            role: 'user',
            content: {
              '0': {
                type: 'text',
                text: {
                  value: 'Hello world!',
                },
              },
            },
            assistant_id: null,
            run_id: null,
            metadata: {
              key1: 'value1',
            },
          },
        });
      case 'modify_message':
        return Promise.resolve({
          status: 'SUCCESS',
          data: {
            id: 'msg_000000000000000000000001',
            created_at: 1707360317,
            thread_id: 'thread_000000000000000000000001',
            role: 'user',
            content: {
              '0': {
                type: 'text',
                text: {
                  value: 'Hello world!',
                },
              },
            },
            assistant_id: null,
            run_id: null,
            metadata: {
              key1: 'value1',
              key2: 'value2',
            },
          },
        });
      case 'list_messages':
        return Promise.resolve({
          status: 'SUCCESS',
          data: {
            data: {
              '0': {
                id: 'msg_000000000000000000000002',
                created_at: 1707360319,
                thread_id: 'thread_000000000000000000000001',
                role: 'assistant',
                content: {
                  '0': {
                    type: 'text',
                    text: {
                      value: 'Hello! How can I assist you today?',
                    },
                  },
                },
                assistant_id: 'asst_000000000000000000000001',
                run_id: 'run_000000000000000000000001',
              },
              '1': {
                id: 'msg_000000000000000000000001',
                created_at: 1707360317,
                thread_id: 'thread_000000000000000000000001',
                role: 'user',
                content: {
                  '0': {
                    type: 'text',
                    text: {
                      value: 'Hello world!',
                    },
                  },
                },
                assistant_id: null,
                run_id: null,
                metadata: {
                  key1: 'value1',
                },
              },
            },
            has_more: false,
          },
        });
      case 'create_run':
        return Promise.resolve({
          status: 'SUCCESS',
          data: {
            id: 'run_000000000000000000000001',
          },
        });
      case 'retrieve_run':
        return Promise.resolve({
          status: 'SUCCESS',
          data: {
            id: 'run_000000000000000000000001',
            status: 'completed',
          },
        });
      default:
        return null;
    }
  });
  const util = jest.requireActual('../src/common/util');
  return {
    ...util,
    validateAndGetAssistant: jest.fn().mockResolvedValue({ id: '1' }),
    validateThread: jest.fn().mockResolvedValue(undefined),
    validateMessage: jest.fn().mockResolvedValue(undefined),
    validateAndGetService: jest.fn().mockResolvedValue({
      request: jest.fn(({ jobType }) => {
        return mockRequest(jobType);
      }),
    }),
    sendTransaction: jest.fn().mockResolvedValue({
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
    }),
  };
});

const TX_PATTERN = /^0x([A-Fa-f0-9]{64})$/;
const MSG_PATTERN = /^msg_([A-Za-z0-9]{24})$/;

jest.setTimeout(60000);

describe('message', () => {
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

  it('should create message', async () => {
    const body: MessageCreateParams = {
      role: 'user',
      content: 'Hello world!',
      metadata: { key1: 'value1' },
    };

    const res = await ainft.chat.message.create(threadId, objectId, tokenId, 'openai', body);

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(Object.keys(res.messages).length).toBe(2);
    expect(res.messages[1].id).toMatch(MSG_PATTERN);
    expect(res.messages[1].thread_id).toBe(threadId);
    expect(res.messages[1].role).toBe('user');
    expect(res.messages[1].content[0].text.value).toBe('Hello world!');
    expect(res.messages[1].metadata).toEqual({ key1: 'value1' });
  });

  it('should get message', async () => {
    const message = await ainft.chat.message.get(messageId, threadId, objectId, tokenId, 'openai');

    expect(message.id).toBe(messageId);
    expect(message.thread_id).toBe(threadId);
    expect(message.role).toBe('user');
    expect(message.content[0].text.value).toBe('Hello world!');
    expect(message.metadata).toEqual({ key1: 'value1' });
  });

  it('should get message list', async () => {
    const messages = await ainft.chat.message.list(threadId, objectId, tokenId, 'openai');

    expect(Object.keys(messages).length).toBe(2);
  });

  it('should update message', async () => {
    const body = { metadata: { key1: 'value1', key2: 'value2' } };

    const res = await ainft.chat.message.update(
      messageId,
      threadId,
      objectId,
      tokenId,
      'openai',
      body
    );

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.message.id).toBe(messageId);
    expect(res.message.role).toBe('user');
    expect(res.message.content[0].text.value).toEqual('Hello world!');
    expect(res.message.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });
});
