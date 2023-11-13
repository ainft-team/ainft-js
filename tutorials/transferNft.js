const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'TOKEN_OWNER_PRIVATE_KEY';
const config = {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai',
}
const ainftJs = new AinftJs(myPrivateKey, config);

const ainftObjectId = 'YOUR_AINFT_OBJECT_ID';
const from = 'TOKEN_OWNER_ADDRESS';
const to = 'RECEIVER_ADDRESS';
const tokenId = 'TOKEN_ID';

const main = async () => {
  try {
    const ainftObject = await ainftJs.nft.get(ainftObjectId);
    const result = await ainftObject.transfer(from, to, tokenId);
    console.log(result);  
  } catch (error) {
    console.log(error);
  }
}

main();
