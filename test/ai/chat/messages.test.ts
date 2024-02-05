import AinftJs, { MessageCreateParams, MessageUpdateParams } from '../../../src/ainft';

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const appId = 'ainft721_0x8a193528f6d406ce81ff5d9a55304337d0ed8de6';
const tokenId = '3';
const serviceName = 'openai_ainize3';
const address = '0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0';

describe('message', () => {
  jest.setTimeout(600000); // 10min
  let ainft: AinftJs;
  let assistantId: string;
  let threadId: string;
  let messageId: string;

  // beforeAll(async () => {
  //   ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
  //     ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  //     ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  //     chainId: 0,
  //   });

  //   const { assistant } = await ainft.chat.assistant.create(objectId, tokenId, 'openai', {
  //     model: 'gpt-3.5-turbo',
  //     name: 'name',
  //     instructions: 'instructions',
  //     metadata: { key1: 'value1' },
  //   });
  //   assistantId = assistant.id;

  //   const { thread } = await ainft.chat.thread.create(objectId, tokenId, 'openai', {
  //     metadata: { key1: 'value1' },
  //   });
  //   threadId = thread.id;
  // });

  // afterAll(async () => {
  //   await ainft.chat.thread.delete(threadId, objectId, tokenId, 'openai');
  //   await ainft.chat.assistant.delete(assistantId, objectId, tokenId, 'openai');
  // });

  it('create: should create message', async () => {
    // const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads/${threadId}/messages`;
    // const body: MessageCreateParams = {
    //   role: 'user',
    //   content: 'hello',
    // };

    // const txResult = await ainft.chat.message.create(threadId, objectId, tokenId, 'openai', body);
    // const messages = await ainft.ain.db.ref(ref).getValue();

    // expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    // expect(txResult.result).toBeDefined();
    // expect(Object.keys(messages).length).toBe(2);
  });

  // it('get: should get message', async () => {
  //   const message = await ainft.chat.message.get(messageId, threadId, objectId, tokenId, 'openai');

  //   expect(message.id).toBe(messageId);
  //   expect(message.thread_id).toBe(threadId);
  //   expect(message.role).toBe('user');
  //   expect(message.content).toEqual([{ type: 'text', text: 'hello' }]);
  //   expect(message.metadata).toEqual({});
  // });

  // it('list: should get message list', async () => {
  //   const messages = await ainft.chat.message.list(threadId, objectId, tokenId, 'openai');

  //   expect(messages.length).toBe(2);
  // });

  // it('update: should update message', async () => {
  //   const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/history/${address}/threads/${threadId}/messages/${messageId}`;
  //   const body: MessageUpdateParams = {
  //     metadata: { key1: 'value1' },
  //   };

  //   const txResult = await ainft.chat.message.update(messageId, threadId, objectId, tokenId, 'openai', body);
  //   const message = await ainft.ain.db.ref(ref).getValue();

  //   expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
  //   expect(txResult.result).toBeDefined();
  //   expect(message.role).toBe('user');
  //   expect(message.content).toBe('hello');
  //   expect(message.metadata).toEqual({ key1: 'value1' });
  // });
});
