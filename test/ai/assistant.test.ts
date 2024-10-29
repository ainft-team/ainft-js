import AinftJs from "../../src/ainft";
import { address, assistantId, objectId, privateKey, tokenId } from "../test_data";
import { ASSISTANT_REGEX, TX_HASH_REGEX } from "../constants";

describe.skip("assistant", () => {
  let ainft: AinftJs;

  beforeAll(async () => {
    ainft = new AinftJs({
      privateKey,
      baseUrl: "https://ainft-api-dev.ainetwork.ai",
      blockchainUrl: "https://testnet-api.ainetwork.ai",
      chainId: 0,
    });
    await ainft.connect();
  });

  afterAll(async () => {
    await ainft.disconnect();
  });

  it("should create assistant", async () => {
    const result = await ainft.assistant.create(objectId, tokenId, {
      model: "gpt-4o",
      name: "name",
      description: "description",
      instructions: null,
      metadata: {
        author: {
          address: "0xabc123",
          username: "username",
          picture: "https://example.com/image.png",
        },
        bio: "bio",
        chatStarter: ["chat_starter_1", "chat_starter_2"],
        greetingMessage: "hello",
        image: "https://example.com/image.png",
        tags: ["tag1", "tag2"],
      },
      autoImage: false,
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.assistant.id).toMatch(ASSISTANT_REGEX);
    expect(result.assistant.model).toBe("gpt-4o");
    expect(result.assistant.name).toBe("name");
    expect(result.assistant.description).toBe("description");
    expect(result.assistant.instructions).toBe(null);
    expect(result.assistant.metadata).toEqual({
      author: {
        address: "0xabc123",
        username: "username",
        picture: "https://example.com/image.png",
      },
      bio: "bio",
      chatStarter: ["chat_starter_1", "chat_starter_2"],
      greetingMessage: "hello",
      image: "https://example.com/image.png",
      tags: ["tag1", "tag2"],
    });
  });

  it('should get assistant', async () => {
    const assistant = await ainft.assistant.get(objectId, tokenId, assistantId);
  });

  it('should list assistants', async () => {
    const result = await ainft.assistant.list([objectId], null);

    expect(result.total).toBeDefined();
    expect(result.items).toBeDefined();
  });

  it("should update assistant", async () => {
    const result = await ainft.assistant.update(objectId, tokenId, assistantId, {
      name: "new_name",
    });

    expect(result.tx_hash).toMatch(TX_HASH_REGEX);
    expect(result.result).toBeDefined();
    expect(result.assistant.id).toBe(assistantId);
    expect(result.assistant.name).toBe("new_name");
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
