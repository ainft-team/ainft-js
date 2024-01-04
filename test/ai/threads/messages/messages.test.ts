import AinftJs from '../../../../src/ainft';

const ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const objectId = '0x45E89F37Cee508cf0D4F6e74b35EfeBdd90BD731';
const appId = 'ainft721_0x45e89f37cee508cf0d4f6e74b35efebdd90bd731';
const aiName = 'ainize_test14';
const tokenId = '3';
const address = '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0';
const threadId = 'thread_000000000000000000000001';
const messageId = 'msg_000000000000000000000001';

describe('Message', () => {
  it('create: should create message', async () => {
    const txResult = await ainft.ai.chat.threads.messages.create(threadId, {
      objectId,
      tokenId,
      provider: 'openai',
      api: 'assistants',
      role: 'user',
      content: 'hello',
    });

    const messages = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${aiName}/history/${address}/threads/${threadId}/messages`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(Object.keys(messages).length).toBe(2);
  }, 10000);

  it('get: should get message', async () => {
    const message = await ainft.ai.chat.threads.messages.get(
      threadId,
      messageId,
      objectId,
      'openai',
      'assistants',
      tokenId,
    );

    expect(message.id).toBe(messageId);
    expect(message.thread_id).toBe(threadId);
    expect(message.role).toBe('user');
    expect(message.content).toEqual([{ type: 'text', text: 'hello' }]);
    expect(message.metadata).toEqual({});
    expect(message.created_at).toBe(0);
  });

  it('update: should update message', async () => {
    const txResult = await ainft.ai.chat.threads.messages.update(
      threadId,
      messageId,
      {
        objectId,
        tokenId,
        provider: 'openai',
        api: 'assistants',
        metadata: { key: 'value' },
      }
    );

    const message = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${aiName}/history/${address}/threads/${threadId}/messages/${messageId}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(message.role).toBe('user');
    expect(message.content).toBe('hello');
    expect(message.metadata).toEqual({ key: 'value' });
  });
});
