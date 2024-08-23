import AinftJs from '../../src/ainft';
import { address, assistantId, objectId, privateKey, tokenId } from '../test_data';
import { ASSISTANT_REGEX, TX_HASH_REGEX } from '../constants';

describe.skip('assistant', () => {
  let ainft: AinftJs;

  beforeAll(async () => {
    ainft = new AinftJs({
      privateKey,
      baseUrl: 'https://ainft-api-dev.ainetwork.ai',
      blockchainUrl: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
    await ainft.connect();
  });

  afterAll(async () => {
    await ainft.disconnect();
  });

  it('should create assistant', async () => {
    const result = await ainft.assistant.create(objectId, tokenId, {
      model: 'gpt-4o-mini',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key1: 'value1' },
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.assistant.id).toMatch(ASSISTANT_REGEX);
    expect(result.assistant.model).toBe('gpt-4o-mini');
    expect(result.assistant.name).toBe('name');
    expect(result.assistant.instructions).toBe('instructions');
    expect(result.assistant.description).toBe('description');
    expect(result.assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('should get assistant', async () => {
    const assistant = await ainft.assistant.get(objectId, tokenId, assistantId);

    expect(assistant.id).toBe(assistantId);
    expect(assistant.model).toBe('gpt-4o-mini');
    expect(assistant.name).toBe('name');
    expect(assistant.instructions).toBe('instructions');
    expect(assistant.description).toBe('description');
    expect(assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('should list assistants', async () => {
    const result = await ainft.assistant.list([objectId], null);

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
});
