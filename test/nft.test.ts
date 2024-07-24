import AinftJs from '../src/ainft';
import { AINFT_OBJECT_REGEX, TX_HASH_REGEX } from './constants';
import { address, privateKey } from './test_data';

describe('nft', () => {
  const ainft = new AinftJs({
    privateKey,
    baseUrl: 'https://ainft-api-dev.ainetwork.ai',
    blockchainUrl: 'https://testnet-api.ainetwork.ai',
    chainId: 0,
  });

  it('should create ainft object', async () => {
    const result = await ainft.nft.create({
      name: 'name',
      symbol: 'symbol',
      description: 'description',
      metadata: {
        author: {
          address: address,
          username: 'username',
        },
        logoImage: 'https://picsum.photos/200/200',
        bannerImage: 'https://picsum.photos/1400/264',
        externalLink: 'https://example.com',
      },
    });

    expect(result.txHash).toMatch(TX_HASH_REGEX);
    expect(result.ainftObject.id).toMatch(AINFT_OBJECT_REGEX);
    expect(result.ainftObject.name).toBe('name');
    expect(result.ainftObject.symbol).toBe('symbol');
    expect(result.ainftObject.owner).toBe(address);
    expect(result.ainftObject.description).toBe('description');
    expect(result.ainftObject.metadata).toEqual({
      author: {
        address: address,
        username: 'username',
      },
      logoImage: 'https://picsum.photos/200/200',
      bannerImage: 'https://picsum.photos/1400/264',
      externalLink: 'https://example.com',
    });
  });
});
