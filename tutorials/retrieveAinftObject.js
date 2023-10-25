const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const ainftObjectId = '';
ainftJs.nft.getNftsByAinftObject(ainftObjectId)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
