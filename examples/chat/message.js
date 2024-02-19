// To run this example you must create a thread (see examples/chat/thread.js)

const AinftJs = require('@ainft-team/ainft-js').default;
const config = require('../config.json');

['privateKey', 'objectId', 'appId', 'tokenId'].forEach((key) => {
  if (!config[key]?.trim()) {
    throw new Error(`${key} is missing or empty in config.json`);
  }
});

const { privateKey, objectId, appId, tokenId } = config; // TODO(user): set these in config.json
const threadId = '<YOUR_THREAD_ID>'; // TODO(user): update this
const params = {
  role: 'user',
  content: 'What is git?', // TODO(user): update this
  metadata: { language: 'en' }, // TODO(user): update this
};

const ainft = new AinftJs(privateKey, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  try {
    console.log('Creating message...\n');

    const { messages, tx_hash } = await ainft.chat.message.create(threadId, objectId, tokenId, 'openai', params);

    console.log(`\nSuccessfully created new message with reply:`);
    console.log(`messages: ${JSON.stringify(messages, null, 2)}`);
    console.log(`txHash: ${tx_hash}`);
    // TODO(jiyoung): update service name in path
    console.log(`View more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${appId}/tokens/${tokenId}/ai/openai_ainize3/history`);
  } catch (error) {
    console.error('Failed to create message: ', error.message);
    process.exit(1);
  }
}

main();
