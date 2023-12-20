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
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      tokenId: tokenId,
    });

    const value = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(value.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(value.config.model).toBe('gpt-3.5-turbo');
    expect(value.config.name).toBe('name');
    expect(value.config.instructions).toBe('instructions');
    expect(value.config).not.toHaveProperty('description');
    expect(value.config).not.toHaveProperty('metadata');
  });

  it('create: should create assistant with required and optional params', async () => {
    const txResult = await ainft.ai.chat.assistants.create({
      config: {
        provider: 'openai',
        api: 'assistants',
        objectId: objectId,
      },
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key: 'value' },
      tokenId: tokenId,
    });

    const value = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();

    expect(value.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(value.config.model).toBe('gpt-3.5-turbo');
    expect(value.config.name).toBe('name');
    expect(value.config.instructions).toBe('instructions');
    expect(value.config.description).toBe('description');
    expect(value.config.metadata).toEqual({ key: 'value' });
  });

  it('update: should not update assistant with required params', async () => {
    const txResult = await ainft.ai.chat.assistants.update(assistantId, {
      config: {
        provider: 'openai',
        api: 'assistants',
        objectId: objectId,
      },
      tokenId: tokenId,
    });

    const value = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(value.id).toMatch(assistantId);
    expect(value.config.model).toBe('gpt-3.5-turbo');
    expect(value.config.name).toBe('name');
    expect(value.config.instructions).toBe('instructions');
    expect(value.config).not.toHaveProperty('description');
    expect(value.config).not.toHaveProperty('metadata');
  });

  it('update: should update assistant with required and optional params', async () => {
    const txResult = await ainft.ai.chat.assistants.update(assistantId, {
      config: {
        provider: 'openai',
        api: 'assistants',
        objectId: objectId,
      },
      model: 'gpt-4',
      name: 'new_name',
      instructions: 'new_instructions',
      description: 'new_description',
      metadata: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      tokenId: tokenId,
    });

    const value = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(txResult.result).toBeDefined();
    expect(value.id).toMatch(assistantId);
    expect(value.config.model).toBe('gpt-4');
    expect(value.config.name).toBe('new_name');
    expect(value.config.instructions).toBe('new_instructions');
    expect(value.config.description).toBe('new_description');
    expect(value.config.metadata).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
    });
  });
});
