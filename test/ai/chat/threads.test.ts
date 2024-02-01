import AinftJs, { ThreadCreateParams, ThreadUpdateParams } from '../../../src/ainft';

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const appId = 'ainft721_0x8a193528f6d406ce81ff5d9a55304337d0ed8de6';
const tokenId = '2';
const serviceName = 'openai_ainize3';
const address = '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0';

describe('thread', () => {
  jest.setTimeout(5 * 60 * 1000);
  let ainft: AinftJs;
  let assistantId: string;
  let threadId: string;

  beforeAll(async () => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });

    const {
      assistant: { id },
    } = await ainft.chat.assistant.create(objectId, tokenId, {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      metadata: { key1: 'value1' },
    });
    assistantId = id;
  });

  afterAll(async () => {
    await ainft.chat.assistant.delete(assistantId, objectId, tokenId, 'openai');
  });

  it('create: should create thread', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads`;
    const params = <ThreadCreateParams>{
      provider: 'openai',
      metadata: { key1: 'value1' },
    };

    const txResult = await ainft.chat.thread.create(objectId, tokenId, params);
    threadId = txResult.thread.id;
    const thread = await ainft.ain.db.ref(`${ref}/${threadId}`).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(thread).not.toBeNull();
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('get: should get thread', async () => {
    const thread = await ainft.chat.thread.get(threadId, objectId, tokenId, 'openai');

    expect(thread.id).toBe(threadId);
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('update: should update thread', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads/${threadId}`;
    const params = <ThreadUpdateParams>{
      provider: 'openai',
      metadata: { key1: 'value1', key2: 'value2' },
    };

    const txResult = await ainft.chat.thread.update(threadId, objectId, tokenId, params);
    const thread = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(thread.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('delete: should delete thread', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads/${threadId}`;

    const txResult = await ainft.chat.thread.delete(threadId, objectId, tokenId, 'openai');
    const thread = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(txResult.delThread.id).toBe(threadId);
    expect(txResult.delThread.deleted).toBe(true);
    expect(thread).toBeNull();
  });
});
