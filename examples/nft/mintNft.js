const AinftJs = require('@ainft-team/ainft-js').default;
const { privateKey, objectId } = require('../config.json'); // TODO(user): set these in config.json

const to = '0x...'; // TODO(user): update this with recipient's ain address
const tokenId = '1'; // TODO(user): update this as string to unique integer

const ainft = new AinftJs({
  privateKey,
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  try {
    console.log('Minting ainft token...\n');

    const ainftObject = await ainft.nft.get(objectId);
    const { tx_hash } = await ainftObject.mint(to, tokenId);

    console.log(`Successfully minted ainft token!`);
    console.log(`tokenId: ${tokenId}`);
    console.log(`txHash: ${tx_hash}`);
    console.log(`\nView more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${ainftObject.appId}/tokens/${tokenId}`);
  } catch (error) {
    console.error('Failed to mint ainft token: ', error.message);
    process.exit(1);
  }
}

main();
