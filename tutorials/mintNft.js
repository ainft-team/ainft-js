const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const nftId = 'your-nft-id';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');
const yourNft = ainftJs.nft.getAinft721(nftId);

const tokenId = '1';
const to = 'receiver address';

yourNft.mint(to, tokenId)
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((error) => {
    console.log(error);
  });
