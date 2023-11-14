const AinftJs = require('@ainft-team/ainft-js').default;

const config = {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
}

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, config);

const getAinftsByAccount = (userAddress, limit, cursor) => {
  ainftJs.nft.getAinftsByAccount(userAddress, limit, cursor)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

const getAinftsByAinftObject = (ainftObjectId, limit, cursor) => {
  ainftJs.nft.getAinftsByAinftObject(ainftObjectId, limit, cursor)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

// getAinftsByAccount('YOUR_ACCOUNT_ADDRESS');
// getAinftsByAinftObject('YOUR_AINFT_OBJECT_ID');
