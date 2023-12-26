import AinftJs from '../../../src/ainft';

const ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const objectId = '0x45E89F37Cee508cf0D4F6e74b35EfeBdd90BD731';
const appId = 'ainft721_0x45e89f37cee508cf0d4f6e74b35efebdd90bd731';
const serviceName = 'ainize_test14';
const tokenId = '1';
const assistantId = 'asst_000000000000000000000001';

describe('Assistant', () => {
  it('create: should create assistant with required params', async () => {
    const txResult = await ainft.ai.chat.assistants.create({
      config: {
        provider: 'openai',
        api: 'assistants',
        objectId: objectId,
      },
      tokenId: tokenId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
    });

    const assistant = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(assistant.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(assistant.object).toBe('assistant');
    expect(assistant.config.model).toBe('gpt-3.5-turbo');
    expect(assistant.config.name).toBe('name');
    expect(assistant.config.instructions).toBe('instructions');
    expect(assistant.config).not.toHaveProperty('description');
    expect(assistant.config).not.toHaveProperty('metadata');
  });

  it('create: should create assistant with required and optional params', async () => {
    const txResult = await ainft.ai.chat.assistants.create({
      config: {
        provider: 'openai',
        api: 'assistants',
        objectId: objectId,
      },
      tokenId: tokenId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key: 'value' },
    });

    const assistant = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(assistant.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(assistant.object).toBe('assistant');
    expect(assistant.config.model).toBe('gpt-3.5-turbo');
    expect(assistant.config.name).toBe('name');
    expect(assistant.config.instructions).toBe('instructions');
    expect(assistant.config.description).toBe('description');
    expect(assistant.config.metadata).toEqual({ key: 'value' });
  });

  it('get: should get assistant', async () => {
    const assistant = await ainft.ai.chat.assistants.get(
      assistantId,
      objectId,
      'openai',
      'assistants',
      tokenId
    );

    expect(assistant.id).toBe(assistantId);
    expect(assistant.model).toBe('gpt-3.5-turbo');
    expect(assistant.name).toBe('name');
    expect(assistant.instructions).toBe('instructions');
    expect(assistant.description).toBe('description');
    expect(assistant.metadata).toEqual({ key: 'value' });
  });

  it('update: should update assistant with required and optional params', async () => {
    const txResult = await ainft.ai.chat.assistants.update(assistantId, {
      config: {
        provider: 'openai',
        api: 'assistants',
        objectId: objectId,
      },
      tokenId: tokenId,
      model: 'gpt-4',
      name: 'new_name',
      instructions: 'new_instructions',
      description: 'new_description',
      metadata: { key1: 'value1', key2: 'value2' },
    });

    const assistant = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(assistant.id).toBe(assistantId);
    expect(assistant.config.model).toBe('gpt-4');
    expect(assistant.config.name).toBe('new_name');
    expect(assistant.config.instructions).toBe('new_instructions');
    expect(assistant.config.description).toBe('new_description');
    expect(assistant.config.metadata).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('delete: should delete assistant', async () => {
    const txResult = await ainft.ai.chat.assistants.delete(assistantId, {
      config: {
        provider: 'openai',
        api: 'assistants',
        objectId: objectId,
      },
      tokenId,
    });

    const assistant = await ainft.ain.db
      .ref(`apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(txResult.delAssistant.id).toBe(assistantId);
    expect(txResult.delAssistant.deleted).toBe(true);
    expect(assistant).toBeNull();
  });
});
