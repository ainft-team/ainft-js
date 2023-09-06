const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const name = 'your-nft-name';
const symbol = 'your-nft-symbol';

ainftJs.nft.create(name, symbol)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
