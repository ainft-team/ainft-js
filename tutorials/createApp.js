const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');
const appId = 'my_first_native_nft';

ainftJs.auth
  .createApp(appId)
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((error) => {
    console.log(error);
  });
