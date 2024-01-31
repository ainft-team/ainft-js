import AinftJs from '../../../src/ainft';

const objectId = '0xC316C7C3eA586eD1Ac9615782D019A4FbD25884f';
const appId = 'ainft721_0xc316c7c3ea586ed1ac9615782d019a4fbd25884f';
const tokenId = '1';
const serviceName = 'openai_ainize3';

describe('assistant', () => {
  let ainft: AinftJs;

  beforeEach(() => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  it('create: should create assistant', async () => {
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`;

    const txResult = await ainft.chat.assistant.create(objectId, tokenId, {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key1: 'value1' },
    });
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
    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}/id`;
    const assistantId = await ainft.ain.db.ref(ref).getValue();

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
    const assistantId = await ainft.ain.db.ref(`${ref}/id`).getValue();

    const txResult = await ainft.chat.assistant.update(assistantId, objectId, tokenId, {
      provider: 'openai',
      model: 'gpt-4',
      name: 'new_name',
      instructions: 'new_instructions',
      description: 'new_description',
      metadata: { key1: 'value1', key2: 'value2' },
    });
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
    const assistantId = await ainft.ain.db.ref(`${ref}/id`).getValue();

    const txResult = await ainft.chat.assistant.delete(assistantId, objectId, tokenId, 'openai');
    const assistant = await ainft.ain.db.ref(ref).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(txResult.delAssistant.id).toBe(assistantId);
    expect(txResult.delAssistant.deleted).toBe(true);
    expect(assistant).toBeNull();
  });
});
