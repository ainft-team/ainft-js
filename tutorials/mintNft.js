const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const appId = 'my_first_native_nft';
const collectionId = 'my_first_collection';
const metadata = {
  name: 'Native NFT Explorer',
  description: 'He is an explorer who pioneers AI networks.',
};

ainftJs.nft
  .mintNft({
    chain: 'AIN',
    network: 'testnet',
    toAddress: 'your-receiver-address', // 0x...
    appId,
    collectionId,
    metadata,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((error) => {
    console.log(error);
  });
