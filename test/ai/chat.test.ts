import AinftJs from '../../src/ainft';

const ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const objectId = '0x45E89F37Cee508cf0D4F6e74b35EfeBdd90BD731';
const appId = 'ainft721_0x45e89f37cee508cf0d4f6e74b35efebdd90bd731';
const aiName = 'ainize_test14';

describe('Chat', () => {
  it('config: should configure chat ai', async () => {
    const txResult = await ainft.ai.chat.config({
      objectId: objectId,
      provider: 'openai',
      api: 'assistants',
    });

    const ai = await ainft.ain.db.ref(`/apps/${appId}/ai/${aiName}`).getValue();

    expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(ai.name).toBe(aiName);
    expect(ai.type).toBe('chat');
    expect(ai.url).toBe(`https://${aiName}.ainetwork.xyz`);
  });

  // TODO(jiyoung): function mocking.
  // it('credit: should deposit credit', async () => {
  //   const txResult = await ainft.ai.chat.depositCredit(
  //     'openai',
  //     'assistants',
  //     10
  //   );

  //   expect(txResult.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
  //   expect(txResult.address).toBe('0x7ed9c30C9F3A31Daa9614b90B4a710f61Bd585c0');
  //   expect(txResult.balance).toBe(10);
  // });
});
