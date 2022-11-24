const AinftJs = require('@ainft-team/ainft-js').default;
const ainUtil = require('@ainblockchain/ain-util');

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
  if (process.argv.length < 5) {
    usage();
  }

  const stage = process.argv[2];
  const appId = process.argv[3];
  const userId = process.argv[4];
  let privateKey = process.argv[5];

  if (stage !== 'DEV' && stage !== 'PROD') {
    console.log('stage must be in DEV or PROD.');
    return;
  }

  if (!privateKey) {
    const account = ainUtil.createAccount();
    privateKey = account.private_key;

    console.log('\nNew ain account created!');
    console.log(account);
    console.log();
  } else {
    let isValid = false;
    try {
      isValid = ainUtil.isValidPrivate(privateKey);
    } catch (error) {
    }
    if (!isValid) {
      console.log('Private key is invalid. Please check private key.');
      return;
    }
  }

  const ainftJs = new AinftJs(
    privateKey,
    ainftServerEndpoint[stage],
    ainBlockchainEndpoint[stage],
    ainBlockchainChainId[stage],
  );
  
  try {
    await ainftJs.auth.initializeApp(appId, userId);
  } catch (error) {
    console.error('Ainft server app creation failed.');
    console.error(error);
  }

  console.log('\nThe app has been created successfully.\n');
}

const usage = () => {
  console.log('\nUsage: node create-ainft-server-app.js <DEV | PROD> <APP ID> <USER ID> <PRIVATE_KEY>\n');
  console.log('<DEV | PROD>: It means stage. dev connects to testnet, prod connects to mainnet.');
  console.log('<APP ID>: This is the app id to create on the ainft server.' +
    'Combinations of lowercase letters, underscores and number are allowed.');
  console.log('<USER ID>: This is the user id used in the ainft server. Become the owner of the app.' +
    'It is recommended to use the userId of the place where ainft-js is used.');
  console.log('<PRIVATE_KEY> (optional): It means ain blockchain private key. If not entered, it will be created automatically.\n')
  console.log('Example: node create-ainft-server-app.js DEV new_app myUserId');
  console.log('Example: node create-ainft-server-app.js DEV new_app myUserId ' +
    '50f561d8a2083d325973bac01b313b05d0466f9e786cb3cb7350b8d2eed7b383');
  process.exit(0);
}

main();