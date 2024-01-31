import AinftJs from '../../../src/ainft';

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const appId = 'ainft721_0x8a193528f6d406ce81ff5d9a55304337d0ed8de6';
const tokenId = '2';
const serviceName = 'openai_ainize3';
const address = '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0';

describe('thread', () => {
  let ainft: AinftJs;

  beforeEach(() => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  it('create: should create thread', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads`;

    const txResult = await ainft.chat.thread.create(objectId, tokenId, {
      provider: 'openai',
      metadata: { key1: 'value1' },
    });
    const threadId = txResult.thread.id;
    const thread = await ainft.ain.db.ref(`${ref}/${threadId}`).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(thread).not.toBeNull();
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('get: should get thread', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads`;
    const threads = await ainft.ain.db.ref(ref).getValue();
    const threadId = Object.keys(threads)[0];

    const thread = await ainft.chat.thread.get(threadId, objectId, tokenId, 'openai');

    expect(thread.id).toBe(threadId);
    expect(thread.messages).toEqual([]);
    expect(thread.metadata).toEqual({});
  });

  it('update: should update thread', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads`;
    const threads = await ainft.ain.db.ref(ref).getValue();
    const threadId = Object.keys(threads)[0];

    const txResult = await ainft.chat.thread.update(threadId, objectId, tokenId, {
      provider: 'openai',
      metadata: { key1: 'value1', key2: 'value2' },
    });
    const thread = await ainft.ain.db.ref(`${ref}/${threadId}`).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(thread.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('delete: should delete thread', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads`;
    const threads = await ainft.ain.db.ref(ref).getValue();
    const threadId = Object.keys(threads)[0];

    const txResult = await ainft.chat.thread.delete(threadId, objectId, tokenId, 'openai');
    const thread = await ainft.ain.db.ref(`${ref}/${threadId}`).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(txResult.delThread.id).toBe(threadId);
    expect(txResult.delThread.deleted).toBe(true);
    expect(thread).toBeNull();
  });
});
