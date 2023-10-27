const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const name = 'YOUR_AINFT_OBJECT_NAME';
const symbol = 'YOUR_AINFT_OBJECT_SYMBOL';

ainftJs.nft.create(name, symbol)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
