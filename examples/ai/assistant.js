// To run this example, you must own an ainft object and token; create one if you don't.
// https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial/create-ainft-object-and-mint

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
    console.log('Creating assistant...\n');

    await ainft.open();

    const { assistant, tx_hash } = await ainft.assistant.create(objectId, tokenId, {
      model: 'gpt-4', // TODO(user): update this
      name: 'QuickSupport', // TODO(user): update this
      instructions: 'Answer tech support questions.', // TODO(user): update this
      description: 'A chatbot for quick tech-related queries.', // TODO(user): update this
      metadata: { topic: 'Tech', language: 'en' }, // TODO(user): update this
    });

    await ainft.close();

    console.log(`\nSuccessfully created assistant with ID: ${assistant.id}`);
    console.log(`assistant: ${JSON.stringify(assistant, null, 4)}`);
    console.log(`txHash: ${tx_hash}`);
    console.log(`\nView more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${appId}/tokens/${tokenId}/ai`);
  } catch (error) {
    console.error('Failed to create assistant: ', error.message);
    process.exit(1);
  }
}

main();
