import AinftJs from '../../src/ainft';
import { messageId, objectId, privateKey, threadId, tokenId, address } from '../test_data';
import { MESSAGE_REGEX, TX_HASH_REGEX } from '../constants';

jest.setTimeout(60 * 1000); // 1min

describe.skip('message', () => {
  let ainft: AinftJs;

  beforeAll(async () => {
    ainft = new AinftJs({
      privateKey,
      baseUrl: 'https://ainft-api-dev.ainetwork.ai',
      blockchainUrl: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
    await ainft.connect();
  });

  afterAll(async () => {
    await ainft.disconnect();
  });

  it('should create message', async () => {
    const result = await ainft.message.create(objectId, tokenId, threadId, {
      role: 'user',
      content: 'Hello world!',
      metadata: { key1: 'value1' },
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(Object.keys(result.messages).length).toBe(2);
    expect(result.messages[1].id).toMatch(MESSAGE_REGEX);
    expect(result.messages[1].thread_id).toBe(threadId);
    expect(result.messages[1].role).toBe('user');
    expect(result.messages[1].content[0].text.value).toBe('Hello world!');
    expect(result.messages[1].metadata).toEqual({ key1: 'value1' });
  });

  it('should get message', async () => {
    const message = await ainft.message.get(objectId, tokenId, threadId, messageId, address);

    expect(message.id).toBe(messageId);
    expect(message.thread_id).toBe(threadId);
    expect(message.role).toBe('user');
    expect(message.content[0].text.value).toBe('Hello world!');
    expect(message.metadata).toEqual({ key1: 'value1' });
  });

  it('should list messages', async () => {
    const messages = await ainft.message.list(objectId, tokenId, threadId, address);

    expect(Object.keys(messages).length).toBe(2);
  });

  it('should update message', async () => {
    const body = { metadata: { key1: 'value1', key2: 'value2' } };

    const result = await ainft.message.update(objectId, tokenId, threadId, messageId, {
      metadata: { key1: 'value1', key2: 'value2' },
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.message.id).toBe(messageId);
    expect(result.message.role).toBe('user');
    expect(result.message.content[0].text.value).toEqual('Hello world!');
    expect(result.message.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });
});
