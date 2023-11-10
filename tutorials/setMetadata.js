const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'YOUR_PRIVATE_KEY';
const config = {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
}
const ainftJs = new AinftJs(myPrivateKey, config);

const ainftObjectId = 'YOUR_AINFT_OBJECT_ID';
const tokenId = '1';
const metadata = {
  name: 'my first token',
  image: 'https://miro.medium.com/v2/resize:fit:2400/1*GWMy0ibykACFKS_rRxFlcw.png'
}


const main = async () => {
  try {
    const ainftObject = await ainftJs.nft.get(ainftObjectId);
    const ainft = await ainftObject.getToken(tokenId);
    const result = await ainft.setMetadata(metadata);
    console.log(result);  
  } catch (error) {
    console.log(error);
  }
}

main();
