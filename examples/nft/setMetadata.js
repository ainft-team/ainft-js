const AinftJs = require('@ainft-team/ainft-js').default;
const { privateKey } = require('../config.json'); // TODO(user): set this in config.json

const ainft = new AinftJs({
  privateKey,
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const objectId = 'YOUR_AINFT_OBJECT_ID';
const tokenId = '1';
const metadata = {
  name: 'my first token',
  image: 'https://miro.medium.com/v2/resize:fit:2400/1*GWMy0ibykACFKS_rRxFlcw.png',
};

const main = async () => {
  try {
    const ainftObject = await ainft.nft.get(objectId);
    const ainft = await ainftObject.getToken(tokenId);
    const result = await ainft.setMetadata(metadata);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
