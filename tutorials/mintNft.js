const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const ainftObjectId = 'YOUR_AINFT_OBJECT_ID';
const to = 'RECEIVER_ADDRESS';
const tokenId = 'TOKEN_ID';

const main = async () => {
  const ainftObject = await ainftJs.nft.get(ainftObjectId);
  const result = await ainftObject.mint(to, tokenId);
  console.log(result);
}

main();