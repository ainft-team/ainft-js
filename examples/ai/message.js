// To run this example you must create a thread (see examples/chat/thread.js)

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
    console.log('Creating message...\n');

    await ainft.connect();

    const threadId = '<YOUR_THREAD_ID>'; // TODO(user): update this
    const { messages, tx_hash } = await ainft.message.create(objectId, tokenId, threadId, {
      role: 'user',
      content: 'What is git?', // TODO(user): update this
      metadata: { language: 'en' }, // TODO(user): update this
    });

    await ainft.disconnect();

    console.log(`\nSuccessfully created new message with reply:`);
    console.log(`messages: ${JSON.stringify(messages, null, 4)}`);
    console.log(`txHash: ${tx_hash}`);
    console.log(`\nView more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${appId}/tokens/${tokenId}/ai/history`);
  } catch (error) {
    console.error('Failed to create message: ', error.message);
    process.exit(1);
  }
}

main();
