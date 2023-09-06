const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const searchCollections = () => {
  const nftId = '';
  const userAddress = '';
  const nftName = '';
  const nftSymbol = '';
  ainftJs.nft.searchCollections()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

const searchAssets = () => {
  const nftId = '';
  const userAddress = '';
  const nftName = '';
  const nftSymbol = '';
  const tokenId = '';
  ainftJs.nft.searchAssets()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

const main = () => {
  searchCollections();
  searchAssets();
}

main();
