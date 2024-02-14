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
const tokenId = '<your token id>';

const ainft = new AinftJs(privateKey, {
  ainftServerEndpoint: `https://ainft-api${stage === 'dev' ? '-dev' : ''}.ainetwork.ai`,
  ainBlockchainEndpoint: `https://${network}-api.ainetwork.ai`,
  chainId: network === 'testnet' ? 0 : 1,
});

async function main() {
  console.log('Creating assistant...\n');

  const { assistant, tx_hash } = await ainft.chat.assistant.create(objectId, tokenId, 'openai', {
    model: 'gpt-3.5-turbo',
    name: '<your name>',
    instructions: '<your instructions>',
    description: '<your description>',
    metadata: {},
  });

  console.log(`Created assistant with ID: ${assistant.id}`);
  console.log(`Assistant data: ${JSON.stringify(assistant, null, 2)}`);
  console.log(`Transaction hash: ${tx_hash}`);
  console.log(
    `View more details at: https://${
      network === 'testnet' ? 'testnet-' : ''
    }insight.ainetwork.ai/database/values/apps/${appId}/tokens/${tokenId}/ai`
  );

  console.log('-----');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
