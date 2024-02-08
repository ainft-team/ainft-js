import AinftJs, { MessageCreateParams } from '../../src/ainft';

jest.mock('../../src/util', () => {
  const actual = jest.requireActual('../../src/util');

  const mockRequest = jest.fn((...params) => {
    let jobType = '';

    if (typeof params[0] === 'string') {
      [jobType] = params;
    } else if (typeof params[0] === 'object' && params[0] !== null) {
      jobType = params[0].jobType;
    } else {
      throw new Error('invalid parameter');
    }

    switch (jobType) {
      case 'create_message':
        return Promise.resolve({});
      case 'retrieve_message':
        return Promise.resolve({
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
        });
      case 'modify_message':
        return Promise.resolve({
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
        });
      case 'list_messages':
        return Promise.resolve({
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
        });
      case 'create_run':
        return Promise.resolve({
          id: 'run_000000000000000000000001',
        });
      case 'retrieve_run':
        return Promise.resolve({
          id: 'run_000000000000000000000001',
          status: 'completed',
        });
      default:
        return null;
    }
  });

  return {
    ...actual,
    validateAndGetAssistant: jest.fn().mockResolvedValue({ id: '1' }),
    validateThread: jest.fn().mockResolvedValue(undefined),
    validateMessage: jest.fn().mockResolvedValue(undefined),
    validateAndGetService: jest.fn().mockResolvedValue({
      request: mockRequest,
    }),
    sendRequestToService: mockRequest,
    sendTransaction: jest.fn().mockResolvedValue({
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
    }),
  };
});

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const tokenId = '1';
const threadId = 'thread_000000000000000000000001';
const messageId = 'msg_000000000000000000000001';

describe('message', () => {
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

  it('create: should create message', async () => {
    const body: MessageCreateParams = {
      role: 'user',
      content: 'Hello world!',
      metadata: { key1: 'value1' },
    };

    const result = await ainft.chat.message.create(threadId, objectId, tokenId, 'openai', body);
    const { messages } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(Object.keys(messages).length).toBe(2);
    expect(messages[1].id).toMatch(/^msg_[A-Za-z0-9]{24}/);
    expect(messages[1].thread_id).toBe(threadId);
    expect(messages[1].role).toBe('user');
    expect(messages[1].content[0].text.value).toBe('Hello world!');
    expect(messages[1].metadata).toEqual({ key1: 'value1' });
  });

  it('get: should get message', async () => {
    const message = await ainft.chat.message.get(messageId, threadId, objectId, tokenId, 'openai');

    expect(message.id).toBe(messageId);
    expect(message.thread_id).toBe(threadId);
    expect(message.role).toBe('user');
    expect(message.content[0].text.value).toBe('Hello world!');
    expect(message.metadata).toEqual({ key1: 'value1' });
  });

  it('list: should get message list', async () => {
    const messages = await ainft.chat.message.list(threadId, objectId, tokenId, 'openai');

    expect(Object.keys(messages).length).toBe(2);
  });

  it('update: should update message', async () => {
    const body = {
      metadata: { key1: 'value1', key2: 'value2' },
    };

    const result = await ainft.chat.message.update(messageId, threadId, objectId, tokenId, 'openai', body);
    const { message } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(message.id).toBe(messageId);
    expect(message.role).toBe('user');
    expect(message.content[0].text.value).toEqual('Hello world!');
    expect(message.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });
});
