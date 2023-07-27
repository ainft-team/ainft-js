const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const searchByAppId = (appId) => {
  ainftJs.nft
    .searchNft({
      chain: 'AIN',
      network: 'testnet',
      appId,
    })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch((error) => {
      console.log(error);
    });
}


const searchByAddress = (address) => {
  ainftJs.nft
    .searchNft({
      chain: 'AIN',
      network: 'testnet',
      address,
    })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch((error) => {
      console.log(error);
    });
}

const searchByCollectionId = (collectionId) => {
  ainftJs.nft
    .searchNft({
      chain: 'AIN',
      network: 'testnet',
      collectionId,
    })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch((error) => {
      console.log(error);
    });
}

const searchByAppIdAndAddress = (appId, address) => {
  ainftJs.nft
    .searchNft({
      chain: 'AIN',
      network: 'testnet',
      appId,
      address,
    })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch((error) => {
      console.log(error);
    });
}

const main = () => {
  const appId = 'my_first_native_nft';
  const collectionId = 'my_first_collection';
  const address = '0x36A5a50C7C0798AA85e135a3167fcA75CF468D35';
  searchByAppId(appId);
  // searchByAddress(address);
  // searchByCollectionId(collectionId);
  // searchByAppIdAndAddress(appId, address);
}

main();
