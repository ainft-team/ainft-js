const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = '94c429182bca8023fcf846921d99f72e4244229bdf9c8972f479c45ea83acb17';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const getNftsByAccount = (userAddress, limit, cursor) => {
  ainftJs.nft.getNftsByAccount(userAddress, limit, cursor)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

const getNftsByAinftObject = (ainftObjectId, limit, cursor) => {
  ainftJs.nft.getNftsByAinftObject(ainftObjectId, limit, cursor)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

// getNftsByAccount('YOUR_ACCOUNT_ADDRESS', 10);
// getNftsByAinftObject('YOUR_AINFT_OBJECT_ID', 20);
