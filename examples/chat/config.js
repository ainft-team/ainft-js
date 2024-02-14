const AinftJs = require('@ainft-team/ainft-js').default;

const privateKey = '<your private key>';
// Use 'dev' or 'prod' api server.
const stage = '<your stage>';
// Use 'testnet' or 'mainnet' blockchain network.
const network = '<your network>';
// To run this example, you must own an ainft object; create one if you don't.
// https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial/create-ainft-object-and-mint
const objectId = '<your object id>';
const appId = '<your app id>';

const ainft = new AinftJs(privateKey, {
  ainftServerEndpoint: `https://ainft-api${stage === 'dev' ? '-dev' : ''}.ainetwork.ai`,
  ainBlockchainEndpoint: `https://${network}-api.ainetwork.ai`,
  chainId: network === 'testnet' ? 0 : 1,
});

async function main() {
  console.log('Configuring chat...\n');

  const { config, tx_hash } = await ainft.chat.configure(objectId, 'openai');

  console.log(`Configured chat for ainft object!`);
  console.log(`Config data: ${JSON.stringify(config, null, 2)}`);
  console.log(`Transaction hash: ${tx_hash}`);
  console.log(
    `View more details at: https://${
      network === 'testnet' ? 'testnet-' : ''
    }insight.ainetwork.ai/database/values/apps/${appId}`
  );

  console.log('-----');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
