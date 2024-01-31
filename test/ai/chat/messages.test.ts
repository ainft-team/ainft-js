import AinftJs from '../../../src/ainft';

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const appId = 'ainft721_0x8a193528f6d406ce81ff5d9a55304337d0ed8de6';
const tokenId = '3';
const serviceName = 'openai_ainize3';
const address = '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0';
const threadId = 'thread_000000000000000000000001';
const messageId = 'msg_000000000000000000000001';

describe('message', () => {
  jest.setTimeout(60 * 1000);
  let ainft: AinftJs;

  beforeEach(() => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  it('create: should create message', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads/${threadId}/messages`;

    const txResult = await ainft.chat.message.create(threadId, objectId, tokenId, {
      provider: 'openai',
      role: 'user',
      content: 'hello',
    });
    const messages = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(Object.keys(messages).length).toBe(2);
  });

  it('get: should get message', async () => {
    const message = await ainft.chat.message.get(messageId, threadId, objectId, tokenId, 'openai');

    expect(message.id).toBe(messageId);
    expect(message.thread_id).toBe(threadId);
    expect(message.role).toBe('user');
    expect(message.content).toEqual([{ type: 'text', text: 'hello' }]);
    expect(message.metadata).toEqual({});
  });

  it('list: should get message list', async () => {
    const messages = await ainft.chat.message.list(threadId, objectId, tokenId, 'openai');

    expect(messages.length).toBe(2);
  });

  it('update: should update message', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads/${threadId}/messages/${messageId}`;
    const txResult = await ainft.chat.message.update(messageId, threadId, objectId, tokenId, {
      provider: 'openai',
      metadata: { key1: 'value1' },
    });

    const message = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(message.role).toBe('user');
    expect(message.content).toBe('hello');
    expect(message.metadata).toEqual({ key1: 'value1' });
  });
});
