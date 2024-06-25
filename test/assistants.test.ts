import AinftJs from '../src/ainft';
import { AssistantCreateParams, AssistantUpdateParams } from '../src/types';
import { test_private_key, test_object_id, test_token_id, test_assistant_id } from './test_data';

jest.mock('../src/common/util', () => {
  const mockRequest = jest.fn((jobType, body) => {
    switch (jobType) {
      case 'create_assistant':
      case 'modify_assistant':
        return { ...body, id: test_assistant_id, created_at: 0 };
      case 'retrieve_assistant':
        return {
          id: test_assistant_id,
          model: 'gpt-3.5-turbo',
          name: 'name',
          instructions: 'instructions',
          description: 'description',
          metadata: { key1: 'value1' },
          created_at: 0,
        };
      case 'delete_assistant':
        return {
          id: test_assistant_id,
          deleted: true,
        };
      default:
        return null;
    }
  });
  const util = jest.requireActual('../src/common/util');
  return {
    ...util,
    validateAssistant: jest.fn().mockResolvedValue(undefined),
    validateAssistantNotExists: jest.fn().mockResolvedValue(undefined),
    sendAinizeRequest: mockRequest,
    sendTransaction: jest.fn().mockResolvedValue({
      tx_hash: '0x' + 'a'.repeat(64),
      result: { code: 0 },
    }),
  };
});

const TX_PATTERN = /^0x([A-Fa-f0-9]{64})$/;
const ASST_PATTERN = /^asst_([A-Za-z0-9]{24})$/;

jest.setTimeout(60000);

describe.skip('assistant', () => {
  let ainft: AinftJs;

  beforeAll(() => {
    ainft = new AinftJs(test_private_key, {
      ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
      ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
      chainId: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create assistant', async () => {
    const body: AssistantCreateParams = {
      model: 'gpt-3.5-turbo',
      name: 'name',
      instructions: 'instructions',
      description: 'description',
      metadata: { key1: 'value1' },
    };

    const res = await ainft.chat.assistant.create(test_object_id, test_token_id, 'openai', body);

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.assistant.id).toMatch(ASST_PATTERN);
    expect(res.assistant.model).toBe('gpt-3.5-turbo');
    expect(res.assistant.name).toBe('name');
    expect(res.assistant.instructions).toBe('instructions');
    expect(res.assistant.description).toBe('description');
    expect(res.assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('should get assistant', async () => {
    const assistant = await ainft.chat.assistant.get(
      test_assistant_id,
      test_object_id,
      test_token_id,
      'openai'
    );

    expect(assistant.id).toBe(test_assistant_id);
    expect(assistant.model).toBe('gpt-3.5-turbo');
    expect(assistant.name).toBe('name');
    expect(assistant.instructions).toBe('instructions');
    expect(assistant.description).toBe('description');
    expect(assistant.metadata).toEqual({ key1: 'value1' });
  });

  it('should update assistant', async () => {
    const body: AssistantUpdateParams = {
      model: 'gpt-4',
      name: 'new_name',
      instructions: 'new_instructions',
      description: 'new_description',
      metadata: { key1: 'value1', key2: 'value2' },
    };

    const res = await ainft.chat.assistant.update(
      test_assistant_id,
      test_object_id,
      test_token_id,
      'openai',
      body
    );

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.assistant.id).toBe(test_assistant_id);
    expect(res.assistant.model).toBe('gpt-4');
    expect(res.assistant.name).toBe('new_name');
    expect(res.assistant.instructions).toBe('new_instructions');
    expect(res.assistant.description).toBe('new_description');
    expect(res.assistant.metadata).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should delete assistant', async () => {
    const res = await ainft.chat.assistant.delete(
      test_assistant_id,
      test_object_id,
      test_token_id,
      'openai'
    );

    expect(res.tx_hash).toMatch(TX_PATTERN);
    expect(res.result).toBeDefined();
    expect(res.delAssistant.id).toBe(test_assistant_id);
    expect(res.delAssistant.deleted).toBe(true);
  });
});
