import AinftJs from '../../src/ainft';
import { address, assistantId, objectId, privateKey, tokenId } from '../test_data';
import { ASSISTANT_REGEX, TX_HASH_REGEX } from '../constants';

describe.skip('assistant', () => {
  let ainft: AinftJs;

  beforeEach(() => {
    ainft = new AinftJs(privateKey, null, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create assistant', async () => {
    const result = await ainft.assistant.create(objectId, tokenId, {
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key1: 'value1' },
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.assistant.id).toMatch(ASSISTANT_REGEX);
    expect(result.assistant.model).toBe('gpt-3.5-turbo');
    expect(result.assistant.name).toBe('name');
    expect(result.assistant.instructions).toBe('instructions');
    expect(result.assistant.description).toBe('description');
    expect(result.assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('should get assistant', async () => {
    const assistant = await ainft.assistant.get(objectId, tokenId, assistantId);

    expect(assistant.id).toBe(assistantId);
    expect(assistant.model).toBe('gpt-3.5-turbo');
    expect(assistant.name).toBe('name');
    expect(assistant.instructions).toBe('instructions');
    expect(assistant.description).toBe('description');
    expect(assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('should list assistants', async () => {
    const result = await ainft.assistant.list(objectId, { limit: 20, offset: 0, order: 'desc' });

    expect(result.total).toBeDefined();
    expect(result.items).toBeDefined();
  });

  it('should update assistant', async () => {
    const result = await ainft.assistant.update(objectId, tokenId, assistantId, {
      model: 'gpt-4',
      name: 'new_name',
      instructions: 'new_instructions',
      description: 'new_description',
      metadata: { key1: 'value1', key2: 'value2' },
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.assistant.id).toBe(assistantId);
    expect(result.assistant.model).toBe('gpt-4');
    expect(result.assistant.name).toBe('new_name');
    expect(result.assistant.instructions).toBe('new_instructions');
    expect(result.assistant.description).toBe('new_description');
    expect(result.assistant.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should delete assistant', async () => {
    const result = await ainft.assistant.delete(objectId, tokenId, assistantId);

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.delAssistant.id).toBe(assistantId);
    expect(result.delAssistant.deleted).toBe(true);
  });

  it('should mint assistant', async () => {
    const result = await ainft.assistant.mint(objectId, address);
  });

  // it('should mint and create assistant', async () => {
  //   const result = await ainft.assistant.mintAndCreate(objectId, address, {
  //     model: 'gpt-3.5-turbo',
  //     name: 'AINA-TKAJYJF1C5',
  //     instructions: '',
  //     description: '일상적인 작업에 적합합니다. GPT-3.5-turbo에 의해 구동됩니다.',
  //     metadata: {
  //       image: 'https://picsum.photos/id/1/200/200',
  //     },
  //   });
  // });
});
