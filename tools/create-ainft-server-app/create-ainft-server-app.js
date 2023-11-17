const AinftJs = require('@ainft-team/ainft-js').default;

const ainftServerEndpoint = {
  DEV: 'https://ainft-api-dev.ainetwork.ai',
  PROD: 'https://ainft-api.ainetwork.ai',
}

const ainBlockchainEndpoint = {
  DEV: 'https://testnet-api.ainetwork.ai',
  PROD: 'https://mainnet-api.ainetwork.ai',
}

const ainBlockchainChainId = {
  DEV: 0,
  PROD: 1
}

const main = async () => {
  if (process.argv.length !== 5) {
    usage();
  }

  const stage = process.argv[2];
  const appId = process.argv[3];
  const privateKey = process.argv[4];

  if (stage !== 'DEV' && stage !== 'PROD') {
    console.log('stage must be in DEV or PROD.');
    return;
  }

  const ainftJs = new AinftJs(
    privateKey,
    ainftServerEndpoint[stage],
    ainBlockchainEndpoint[stage],
    ainBlockchainChainId[stage],
  );
  
  try {
    const res = await ainftJs.auth.createApp(appId);
    if (res.result.code !== 0) {
      throw res.result.message;
    }
    console.log('\nThe app has been created successfully.\n');
    const res1 = await ainftJs.auth.registerBlockchainApp(appId);
    console.log('registerBlockchainApp response', res1);
    const res2 = await ainftJs.auth.delegateApp(appId);
    console.log('delegateApp response', JSON.stringify(res2, null, 2));
  } catch (error) {
    console.error('Ainft server app creation failed.');
    console.error(error);
  }

}

const usage = () => {
  console.log('\nUsage: node create-ainft-server-app.js <DEV | PROD> <APP ID> <USER ID> <ACCESS KEY>\n');
  console.log('<DEV | PROD>: It means stage. dev connects to testnet, prod connects to mainnet.');
  console.log('<APP ID>: This is the app id to create on the ainft server.' +
    'Combinations of lowercase letters, underscores and number are allowed.');
  console.log('<PRIVATE KEY>: It means ain blockchain private key. You must have the access key to use the APIs of the AINFT server.\n')
  console.log('Example: node create-ainft-server-app.js DEV new_app myUserId ' +
    '50f561d8a2083d325973bac01b313b05d0466f9e786cb3cb7350b8d2eed7b383');
  process.exit(0);
}

main();