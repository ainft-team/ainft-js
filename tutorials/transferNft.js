const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const appId = 'my_first_native_nft';
const collectionId = 'my_first_collection';
const tokenId = '2';

ainftJs.nft
  .transferNft({
    chain: 'AIN',
    network: 'testnet',
    toAddress: 'your-receiver-address', // 0x...
    appId,
    collectionId,
    tokenId,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((error) => {
    console.log(error);
  });
