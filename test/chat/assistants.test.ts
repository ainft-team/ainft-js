import AinftJs, { AssistantCreateParams, AssistantUpdateParams } from '../../src/ainft';
import * as util from '../../src/util';

jest.mock('../../src/util', () => {
  const actual = jest.requireActual('../../src/util');
  return {
    ...actual,
    validateAssistant: jest.fn().mockResolvedValue(undefined),
    sendRequestToService: jest.fn(),
    sendTransaction: jest.fn().mockResolvedValue({
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
    }),
  };
});

const objectId = '0x8A193528F6d406Ce81Ff5D9a55304337d0ed8DE6';
const tokenId = '1';
const assistantId = 'asst_000000000000000000000001';

describe('assistant', () => {
  jest.setTimeout(60000); // 1min
  let ainft: AinftJs;

  beforeAll(() => {
    ainft = new AinftJs(process.env['PRIVATE_KEY']!, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('create: should create assistant', async () => {
    const body: AssistantCreateParams = {
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      // TODO(jiyoung): handle empty metadata in blockchain transaction.
      // if no metadata is provided, openai defaults to an empty object,
      // which leads to transaction reversion as it cannot be stored on the blockchain.
      metadata: { key1: 'value1' },
    };

    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      ...body,
      id: assistantId,
      created_at: 0,
    });

    const result = await ainft.chat.assistant.create(objectId, tokenId, 'openai', body);
    const { assistant } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(assistant.id).toMatch(/^asst_[A-Za-z0-9]{24}/);
    expect(assistant.model).toBe('gpt-3.5-turbo');
    expect(assistant.name).toBe('name');
    expect(assistant.instructions).toBe('instructions');
    expect(assistant.description).toBe('description');
    expect(assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('get: should get assistant', async () => {
    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      id: assistantId,
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key1: 'value1' },
      created_at: 0,
    });

    const assistant = await ainft.chat.assistant.get(assistantId, objectId, tokenId, 'openai');

    expect(assistant.id).toBe(assistantId);
    expect(assistant.model).toBe('gpt-3.5-turbo');
    expect(assistant.name).toBe('name');
    expect(assistant.instructions).toBe('instructions');
    expect(assistant.description).toBe('description');
    expect(assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('update: should update assistant', async () => {
    const body: AssistantUpdateParams = {
      model: 'gpt-4',
      name: 'new_name',
      instructions: 'new_instructions',
      description: 'new_description',
      metadata: { key1: 'value1', key2: 'value2' },
    };

    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      ...body,
      id: assistantId,
      created_at: 0,
    });

    const result = await ainft.chat.assistant.update(assistantId, objectId, tokenId, 'openai', body);
    const { assistant } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(assistant.id).toBe(assistantId);
    expect(assistant.model).toBe('gpt-4');
    expect(assistant.name).toBe('new_name');
    expect(assistant.instructions).toBe('new_instructions');
    expect(assistant.description).toBe('new_description');
    expect(assistant.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('delete: should delete assistant', async () => {
    (util.sendRequestToService as jest.Mock).mockResolvedValue({
      id: assistantId,
      deleted: true,
    });

    const result = await ainft.chat.assistant.delete(assistantId, objectId, tokenId, 'openai');
    const { delAssistant } = result;

    expect(result.tx_hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.result).toBeDefined();
    expect(delAssistant.id).toBe(assistantId);
    expect(delAssistant.deleted).toBe(true);
  });
});
