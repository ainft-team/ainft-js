import AinftJs from '../../../src/ainft';

const ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const objectId = '0x45E89F37Cee508cf0D4F6e74b35EfeBdd90BD731';
const appId = 'ainft721_0x45e89f37cee508cf0d4f6e74b35efebdd90bd731';
const aiName = 'ainize_test14';
const tokenId = '2';
const address = '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0';
const threadId = 'thread_000000000000000000000001';

describe('Thread', () => {
  beforeAll(async () => {
    await ainft.ai.chat.assistants.create({
      config: {
        objectId: objectId,
        provider: 'openai',
        api: 'assistants',
      },
      tokenId: tokenId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
    });
  });

  it('create: should create thread', async () => {
    const txResult = await ainft.ai.chat.threads.create({
      config: {
        objectId: objectId,
        provider: 'openai',
        api: 'assistants',
      },
      tokenId: tokenId,
      metadata: { key: 'value' },
    });

    const thread = await ainft.ain.db
      .ref(
        `/apps/${appId}/tokens/${tokenId}/ai/${aiName}/history/${address}/threads/${threadId}`
      )
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(thread).not.toBeNull();
    expect(thread.metadata).toEqual({ key: 'value' });
  });

  it('get: should get thread', async () => {
    const thread = await ainft.ai.chat.threads.get(
      threadId,
      objectId,
      'openai',
      'assistants',
      tokenId
    );

    expect(thread.id).toBe(threadId);
    expect(thread.messages).toEqual([]);
    expect(thread.metadata).toEqual({});
    expect(thread.created_at).toBe(0);
  });

  it('update: should update thread', async () => {
    const txResult = await ainft.ai.chat.threads.update(threadId, {
      config: {
        objectId: objectId,
        provider: 'openai',
        api: 'assistants',
      },
      tokenId: tokenId,
      metadata: { key1: 'value1', key2: 'value2' },
    });

    const thread = await ainft.ain.db
      .ref(
        `/apps/${appId}/tokens/${tokenId}/ai/${aiName}/history/${address}/threads/${threadId}`
      )
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(thread.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('delete: should delete thread', async () => {
    const txResult = await ainft.ai.chat.threads.delete(threadId, {
      config: {
        objectId: objectId,
        provider: 'openai',
        api: 'assistants',
      },
      tokenId: tokenId,
    });

    const thread = await ainft.ain.db
      .ref(
        `/apps/${appId}/tokens/${tokenId}/ai/${aiName}/history/${address}/threads/${threadId}`
      )
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(txResult.delThread.id).toBe(threadId);
    expect(txResult.delThread.deleted).toBe(true);
    expect(thread).toBeNull();
  });
});
