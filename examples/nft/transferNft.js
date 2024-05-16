const AinftJs = require('@ainft-team/ainft-js').default;
const { privateKey } = require('../config.json'); // TODO(user): set this in config.json

const objectId = 'YOUR_AINFT_OBJECT_ID';
const from = 'TOKEN_OWNER_ADDRESS';
const to = 'RECEIVER_ADDRESS';
const tokenId = 'TOKEN_ID';

const ainft = new AinftJs({
  privateKey,
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const main = async () => {
  try {
    const ainftObject = await ainft.nft.get(objectId);
    const result = await ainftObject.transfer(from, to, tokenId);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
