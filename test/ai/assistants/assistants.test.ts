import AinftJs, { AssistantCreateParams } from '../../../src/ainft';

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
    const params: AssistantCreateParams = {
      objectId: objectId,
      provider: 'openai',
      api: 'assistants',
      tokenId: tokenId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
    };

    const resp = await ainft.ai.chat.assistants.create(params);
    const value = await ainft.ain.db
      .ref(`/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`)
      .getValue();

    expect(resp.txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(resp.assistant.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(resp.assistant.model).toBe(params.model);
    expect(resp.assistant.name).toBe(params.name);
    expect(resp.assistant.instructions).toBe(params.instructions);
    expect(resp.assistant.description).toBe(null);

    expect(value.id).toBe(resp.assistant.id);
    expect(value.config.model).toBe(resp.assistant.model);
    expect(value.config.name).toBe(resp.assistant.name);
    expect(value.config.instructions).toBe(resp.assistant.instructions);
    expect(value.config).not.toHaveProperty('description');
  });
});
