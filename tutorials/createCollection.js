const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const appId = 'my_first_native_nft';
const collectionId = 'my_first_collection';
const symbol = 'MFNC';
const name = 'my first native nft collection';

ainftJs.nft
  .createNftCollection({
    chain: 'AIN',
    network: 'testnet',
    appId,
    collectionId,
    symbol,
    name,
    tokenUpdatePermission: {
      collectionOwner: true,
      tokenOwner: true,
    },
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
