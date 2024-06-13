const AinftJs = require('@ainft-team/ainft-js').default;
const { privateKey, objectId, appId, tokenId } = require('../config.json'); // TODO(user): set these in config.json

const ainft = new AinftJs({
  privateKey,
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  try {
    console.log('Creating thread...\n');

    await ainft.connect();

    const { thread, tx_hash } = await ainft.thread.create(objectId, tokenId, {});

    await ainft.disconnect();

    console.log(`\nSuccessfully created thread with ID: ${thread.id}`);
    console.log(`thread: ${JSON.stringify(thread, null, 2)}`);
    console.log(`txHash: ${tx_hash}`);
    console.log(`\nView more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${appId}/tokens/${tokenId}/ai/history`);
  } catch (error) {
    console.error('Failed to create thread: ', error.message);
    process.exit(1);
  }
}

main();
