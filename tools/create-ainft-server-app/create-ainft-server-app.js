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
  if (process.argv.length < 6) {
    usage();
  }

  const stage = process.argv[2];
  const appId = process.argv[3];
  const userId = process.argv[4];
  const accessKey = process.argv[5];

  if (stage !== 'DEV' && stage !== 'PROD') {
    console.log('stage must be in DEV or PROD.');
    return;
  }

  const ainftJs = new AinftJs(
    accessKey,
    ainftServerEndpoint[stage],
    ainBlockchainEndpoint[stage],
    ainBlockchainChainId[stage],
  );
  
  try {
    await ainftJs.auth.initializeApp(appId, userId);
    console.log('\nThe app has been created successfully.\n');
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
  console.log('<USER ID>: This is the user id used in the ainft server. Become the owner of the app.' +
    'It is recommended to use the userId of the place where ainft-js is used.');
  console.log('<ACCESS KEY>: It means ain blockchain private key. You must have the access key to use the APIs of the AINFT server.\n')
  console.log('Example: node create-ainft-server-app.js DEV new_app myUserId ' +
    '50f561d8a2083d325973bac01b313b05d0466f9e786cb3cb7350b8d2eed7b383');
  process.exit(0);
}

main();