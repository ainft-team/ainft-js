const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const userAddress = '';
ainftJs.nft.getNftsByAinftObject(userAddress)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
