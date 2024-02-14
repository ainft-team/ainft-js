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
  console.log('Creating thread...\n');

  const { thread, tx_hash: txHash1 } = await ainft.chat.thread.create(objectId, tokenId, 'openai', {
    metadata: {},
  });

  console.log(`Created thread with ID: ${thread.id}`);
  console.log(`Thread data: ${JSON.stringify(thread, null, 2)}`);
  console.log(`Transaction hash: ${txHash1}`);
  console.log(
    `View more details at: https://${
      network === 'testnet' ? 'testnet-' : ''
    }insight.ainetwork.ai/database/values/apps/${appId}/tokens/${tokenId}/ai`
  );

  console.log('-----');

  console.log('Creating message');

  const { messages, tx_hash } = await ainft.chat.message.create(objectId, tokenId, 'openai', {
    role: 'user',
    content: '<your content>',
    metadata: {},
  });

  console.log(`Created new message with reply:`);
  console.log(`messages data: ${JSON.stringify(messages, null, 2)}`);
  console.log(`transaction hash: ${tx_hash}`);
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
