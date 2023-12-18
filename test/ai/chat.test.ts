import AinftJs from '../../src/ainft';

const ainft = new AinftJs(process.env['TEST_PRIVATE_KEY']!, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const objectId = '0x45E89F37Cee508cf0D4F6e74b35EfeBdd90BD731';
const appId = 'ainft721_0x45e89f37cee508cf0d4f6e74b35efebdd90bd731';
const serviceName = 'ainize_test14';

describe('Chat', () => {
  it('should configure chat ai', async () => {
    const result = await ainft.ai.chat.config({
      objectId: objectId,
      provider: 'openai',
      api: 'assistants',
    });
    const value = await ainft.ain.db
      .ref(`/apps/${appId}/ai/${serviceName}`)
      .getValue();

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(value.name).toBe(serviceName);
    expect(value.type).toBe('chat');
    expect(value.url).toBe(`https://${serviceName}.ainetwork.xyz`);
  });
});
