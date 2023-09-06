const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const nftId = 'your-nft-id';
const from = 'token-owner-address';
const to = 'receiver-address';
const tokenId = '1';

const yourNft = ainftJs.nft.getAinft721(nftId);
yourNft.transfer(from, to, tokenId)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
