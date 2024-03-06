const AinftJs = require('@ainft-team/ainft-js').default;
const config = require('../config.json');

['privateKey', 'objectId', 'appId', 'tokenId'].forEach((key) => {
  if (!config[key]?.trim()) {
    throw new Error(`${key} is missing or empty in config.json`);
  }
});

const { privateKey, objectId, appId, tokenId } = config; // TODO(user): set these in config.json

const ainft = new AinftJs(privateKey, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  try {
    console.log('Creating thread...\n');

    const { thread, tx_hash } = await ainft.chat.thread.create(objectId, tokenId, 'openai', {});

    console.log(`\nSuccessfully created thread with ID: ${thread.id}`);
    console.log(`thread: ${JSON.stringify(thread, null, 2)}`);
    console.log(`txHash: ${tx_hash}`);
    // TODO(jiyoung): update service name in path 
    console.log(`View more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${appId}/tokens/${tokenId}/ai/ainize_openai/history`);
  } catch (error) {
    console.error('Failed to create thread: ', error.message);
    process.exit(1);
  }
}

main();
