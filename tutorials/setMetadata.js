const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const ainftObjectId = 'YOUR_AINFT_OBJECT_ID';
const tokenId = '1';
const metadata = {
  name: 'my first token',
  image: 'https://miro.medium.com/v2/resize:fit:2400/1*GWMy0ibykACFKS_rRxFlcw.png'
}


const main = async () => {
  const ainftObject = await ainftJs.nft.get(ainftObjectId);
  const ainft = await ainftObject.get(tokenId);
  const result = await ainft.setMetadata(metadata);
  console.log(result);
}

main();
