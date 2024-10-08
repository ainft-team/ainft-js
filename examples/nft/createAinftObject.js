const AinftJs = require('@ainft-team/ainft-js').default;
const { privateKey } = require('../config.json'); // TODO(user): set this in config.json

const name = 'MyObject'; // TODO(user): update this
const symbol = 'MYOBJ'; // TODO(user): update this

const ainft = new AinftJs({
  privateKey,
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  try {
    console.log('Creating ainft object...\n');

    const { ainftObject, txHash } = await ainft.nft.create(name, symbol);

    console.log(`Successfully created ainft object!`);
    console.log(`objectId: ${ainftObject.id}`);
    console.log(`appId: ${ainftObject.appId}`);
    console.log(`txHash: ${txHash}`);
    console.log(`\nView more details at: https://testnet-insight.ainetwork.ai/database/values/apps/${ainftObject.appId}`);
  } catch (error) {
    console.error('Failed to create ainft object: ', error.message);
    process.exit(1);
  }
}

main();
