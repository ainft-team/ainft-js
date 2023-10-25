const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const searchAinftObjects = async () => {
  const filter = {
    ainftObjectId: '',
    userAddress: '',
    name: '',
    symbol: '',
    limit: 0,
    cursor: '',
  }
  ainftJs.nft.searchAinftObjects(filter)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    })
}

const searchNfts = async () => {
  const filter = {
    ainftObjectId: '',
    userAddress: '',
    tokenId: '',
    name: '',
    symbol: '',
    limit: 0,
    cursor: '',
  }
  ainftJs.nft.searchNfts()
    .then((res) => {
      console.log(res);
      })
    .catch((error) => {
      console.log(error);
    });
}
