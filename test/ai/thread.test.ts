import AinftJs from '../../src/ainft';
import { privateKey, objectId, tokenId, threadId } from '../test_data';
import { TX_HASH_REGEX, THREAD_REGEX } from '../constants';

describe.skip('thread', () => {
  let ainft: AinftJs;

  beforeEach(async () => {
    ainft = new AinftJs(privateKey, null, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should create thread', async () => {
    const result = await ainft.thread.create(objectId, tokenId, {
      metadata: { key1: 'value1' },
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.thread.id).toMatch(THREAD_REGEX);
    expect(result.thread.metadata).toEqual({ key1: 'value1' });
  });

  it('should get thread', async () => {
    const thread = await ainft.thread.get(objectId, tokenId, threadId);

    expect(thread.id).toBe(threadId);
    expect(thread.metadata).toEqual({ key1: 'value1' });
  });

  it('should list threads', async () => {
    const result = await ainft.thread.list(objectId, null, null, { limit: 20, order: 'desc' });

    expect(result.items).toBeDefined();
  });

  it('should update thread', async () => {
    const result = await ainft.thread.update(objectId, tokenId, threadId, {
      metadata: { key1: 'value1', key2: 'value2' },
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.thread.id).toBe(threadId);
    expect(result.thread.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should delete thread', async () => {
    const result = await ainft.thread.delete(objectId, tokenId, threadId);

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.delThread.id).toBe(threadId);
    expect(result.delThread.deleted).toBe(true);
  });

  it('should create and run thread', async () => {
    const result = await ainft.thread.createAndRun(objectId, tokenId, {
      metadata: { title: 'New chat' },
      messages: [{ role: 'user', content: '안녕하세요' }],
    });
  });
});
