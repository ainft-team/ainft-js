const AinftJs = require('@ainft-team/ainft-js').default;

const privateKey = '<your private key>';
// Use 'dev' or 'prod' api server.
const stage = '<your stage>';
// Use 'testnet' or 'mainnet' blockchain network.
const network = '<your network>';

const ainft = new AinftJs(privateKey, {
  ainftServerEndpoint: `https://ainft-api${stage === 'dev' ? '-dev' : ''}.ainetwork.ai`,
  ainBlockchainEndpoint: `https://${network}-api.ainetwork.ai`,
  chainId: network === 'testnet' ? 0 : 1,
});

async function main() {
  console.log('Depositing credit...\n');

  // Use the [faucet](https://faucet.ainetwork.ai) to get test AIN for testnet.
  const { tx_hash, address, balance } = await ainft.chat.depositCredit('openai', 10);

  console.log(`Deposited credit for chatting!`);
  console.log(`Address: ${address}`);
  console.log(`Balance: ${balance}`);
  console.log(`Transaction hash: ${tx_hash}`);
  console.log(
    `View more details at: https://${
      network === 'testnet' ? 'testnet-' : ''
    }insight.ainetwork.ai/transactions/${tx_hash}`
  );

  console.log('-----');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
