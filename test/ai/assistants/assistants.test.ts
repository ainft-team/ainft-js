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

describe('Assistant', () => {
  it('create: should create assistant with required params', async () => {
    const result = await ainft.ai.chat.assistants.create({
      objectId: objectId,
      provider: 'openai',
      api: 'assistants',
      tokenId: tokenId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
    });
    const value = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(result.assistant.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(result.assistant.model).toBe('gpt-3.5-turbo');
    expect(result.assistant.name).toBe('name');
    expect(result.assistant.instructions).toBe('instructions');
    expect(result.assistant.description).toBeNull();

    expect(value.id).toBe('asst_000000000000000000000001');
    expect(value.config.model).toBe('gpt-3.5-turbo');
    expect(value.config.name).toBe('name');
    expect(value.config.instructions).toBe('instructions');
    expect(value.config).not.toHaveProperty('description');
  });
});
