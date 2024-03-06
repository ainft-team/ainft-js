// To run this example, you must own an ainft object; create one if you don't.
// https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial/create-ainft-object-and-mint

const AinftJs = require('@ainft-team/ainft-js').default;
const config = require('../config.json');

['privateKey', 'objectId', 'appId'].forEach((key) => {
  if (!config[key]?.trim()) {
    throw new Error(`${key} is missing or empty in config.json`);
  }
});

const { privateKey, objectId, appId } = config; // TODO(user): set these in config.json

const ainft = new AinftJs(privateKey, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  try {
    console.log('Configuring chat...\n');

    const { config, tx_hash } = await ainft.chat.configure(objectId, 'openai');

    console.log(`Successfully configured chat for ainft object!`);
    console.log(`config: ${JSON.stringify(config, null, 2)}`);
    console.log(`txHash: ${tx_hash}`);
    console.log(`View more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${appId}`);
  } catch (error) {
    console.error('Failed to configure chat: ', error.message);
    process.exit(1);
  }
}

main();
