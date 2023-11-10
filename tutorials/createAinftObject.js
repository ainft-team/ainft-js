const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const config = { 
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai'
}
const ainftJs = new AinftJs(myPrivateKey, config);

const name = 'YOUR_AINFT_OBJECT_NAME';
const symbol = 'YOUR_AINFT_OBJECT_SYMBOL';

ainftJs.nft.create(name, symbol)
  .then((result) => {
    const { ainftObject, txHash } = result;
    console.log(txHash);
    console.log(ainftObject.id);
    console.log(ainftObject.appId);
  })
  .catch((error) => {
    console.log(error);
  });
