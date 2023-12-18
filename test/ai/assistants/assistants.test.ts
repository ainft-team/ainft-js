import AinftJs, { AssistantCreateParams } from '../../../src/ainft';

const ainft = new AinftJs(process.env['TEST_PRIVATE_KEY']!, {
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
    const params: AssistantCreateParams = {
      objectId: objectId,
      provider: 'openai',
      api: 'assistants',
      tokenId: tokenId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
    };

    const result = await ainft.ai.chat.assistants.create(params);
    const value = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.assistant.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(result.assistant.model).toBe(params.model);
    expect(result.assistant.name).toBe(params.name);
    expect(result.assistant.instructions).toBe(params.instructions);
    expect(result.assistant.description).toBe(null);

    expect(value.id).toBe(result.assistant.id);
    expect(value.config.model).toBe(result.assistant.model);
    expect(value.config.name).toBe(result.assistant.name);
    expect(value.config.instructions).toBe(result.assistant.instructions);
    expect(value.config).not.toHaveProperty('description');
  });
});
