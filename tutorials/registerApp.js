const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');
const appId = 'my_first_native_nft';

const main = async () => {
  try {
    const res1 = await ainftJs.auth.registerBlockchainApp(appId);
    console.log('registerBlockchainApp response', res1);
    const res2 = await ainftJs.auth.delegateApp(appId);
    console.log('delegateApp response', JSON.stringify(res2, null, 2));
  } catch (error) {
    console.log(error);
  }
};

main();
