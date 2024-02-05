import AinftJs, { AssistantCreateParams, AssistantUpdateParams } from '../../../src/ainft';

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const appId = 'ainft721_0x8a193528f6d406ce81ff5d9a55304337d0ed8de6';
const tokenId = '1';
const serviceName = 'openai_ainize3';

describe('assistant', () => {
  jest.setTimeout(300000); // 5min
  let ainft: AinftJs;
  let assistantId: string;

  beforeAll(() => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  it('create: should create assistant', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`;
    const body: AssistantCreateParams = {
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      // TODO(jiyoung): handle empty metadata in blockchain transaction.
      // if metadata is not provided, OpenAI set default empty object.
      // but empty object is not stored on blockchain, leading to transaction reversion.
      metadata: { key1: 'value1' },
    };

    const txResult = await ainft.chat.assistant.create(objectId, tokenId, 'openai', body);
    assistantId = txResult.assistant.id;
    const assistant = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(assistant.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(assistant.config.model).toBe('gpt-3.5-turbo');
    expect(assistant.config.name).toBe('name');
    expect(assistant.config.instructions).toBe('instructions');
    expect(assistant.config.description).toBe('description');
    expect(assistant.config.metadata).toEqual({ key1: 'value1' });
  });

  it('get: should get assistant', async () => {
    const assistant = await ainft.chat.assistant.get(assistantId, objectId, tokenId, 'openai');

    expect(assistant.id).toBe(assistantId);
    expect(assistant.model).toBe('gpt-3.5-turbo');
    expect(assistant.name).toBe('name');
    expect(assistant.instructions).toBe('instructions');
    expect(assistant.description).toBe('description');
    expect(assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('update: should update assistant', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`;
    const body: AssistantUpdateParams = {
      model: 'gpt-4',
      name: 'new_name',
      instructions: 'new_instructions',
      description: 'new_description',
      metadata: { key1: 'value1', key2: 'value2' },
    };

    const txResult = await ainft.chat.assistant.update(assistantId, objectId, tokenId, 'openai', body);
    const assistant = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(assistant.id).toBe(assistantId);
    expect(assistant.config.model).toBe('gpt-4');
    expect(assistant.config.name).toBe('new_name');
    expect(assistant.config.instructions).toBe('new_instructions');
    expect(assistant.config.description).toBe('new_description');
    expect(assistant.config.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('delete: should delete assistant', async () => {
    const ref = `apps/${appId}/tokens/${tokenId}/ai/${serviceName}`;

    const txResult = await ainft.chat.assistant.delete(assistantId, objectId, tokenId, 'openai');
    const assistant = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(txResult.delAssistant.id).toBe(assistantId);
    expect(txResult.delAssistant.deleted).toBe(true);
    expect(assistant).toBeNull();
  });
});
