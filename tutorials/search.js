const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const searchAinftObjects = async () => {
  ainftJs.nft.searchAinftObjects()
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    })
}

const searchNfts = async () => {
  ainftJs.nft.searchNfts()
    .then((res) => {
      console.log(res);
      })
    .catch((error) => {
      console.log(error);
    });
}
