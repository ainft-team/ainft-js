const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = '94c429182bca8023fcf846921d99f72e4244229bdf9c8972f479c45ea83acb17';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const userAddress = '';
ainftJs.nft.getNftsByAccount(userAddress)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
