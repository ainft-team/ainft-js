const AinftJs = require('@ainft-team/ainft-js').default;
const { address, privateKey, objectId } = require('../config.json'); // TODO(user): set these in config.json

const ainft = new AinftJs({
  privateKey,
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const getAinftsByAccount = async (userAddress, limit, cursor) => {
  return ainft.nft.getAinftsByAccount(userAddress, limit, cursor);
};

const getAinftsByAinftObject = async (ainftObjectId, limit, cursor) => {
  return ainft.nft.getAinftsByAinftObject(ainftObjectId, limit, cursor);
};

async function main() {
  try {
    console.log('Retrieving ainft tokens by account...\n');
    const result1 = await getAinftsByAccount(address);
    console.log('Successfully retrieved ainft tokens by account!');
    console.log(JSON.stringify(result1, null, 4));
    console.log();

    console.log('Retrieving ainft tokens by object...\n');
    const result2 = await getAinftsByAinftObject(objectId);
    console.log('Successfully retrieved ainft tokens by object!');
    console.log(JSON.stringify(result2, null, 4));
  } catch (error) {
    console.error('Failed to retrieve ainft token: ', error.message);
    process.exit(1);
  }
}

main();
