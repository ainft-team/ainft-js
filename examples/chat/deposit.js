const AinftJs = require('@ainft-team/ainft-js').default;
const config = require('../config.json');

if (!config.privateKey?.trim()) {
  throw new Error('privateKey is missing or empty in config.json');
}

const { privateKey } = config;

const ainft = new AinftJs(privateKey, {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  try {
    console.log('Depositing credit...\n');

    // TODO(user): get testnet AIN from [faucet](https://faucet.ainetwork.ai)
    const { tx_hash, address, balance } = await ainft.chat.depositCredit('openai', 10);

    console.log(`\nSuccessfully deposited credit for chatting!`);
    console.log(`address: ${address}`);
    console.log(`balance: ${balance}`);
    console.log(`txHash: ${tx_hash}`);
    console.log(`View more details at: https://testnet-insight.ainetwork.ai/transactions/${tx_hash}`);
  } catch (error) {
    console.error('Failed to deposit credit: ', error.message);
    process.exit(1);
  }

  try {
    console.log('\nChecking credit...\n');

    const balance = await ainft.chat.getCredit('openai');

    console.log(`\nSuccessfully checked credit!`);
    console.log(`balance: ${balance}`);
  } catch (error) {
    console.error('Failed to check credit:', error.message);
    process.exit(2);
  }
}

main();
