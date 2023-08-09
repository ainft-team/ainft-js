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

const ainBlockchainNetwork = {
  DEV: 'testnet',
  PROD: 'mainnet',
}

const main = async () => {
  if (process.argv.length !== 8) {
    usage();
  }

  const stage = process.argv[2];
  const appId = process.argv[3];
  const collectionId = process.argv[4];
  const symbol = process.argv[5];
  const name = process.argv[6];
  const privateKey = process.argv[7];

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
    const res = await ainftJs.nft.createNftCollection({
      chain: 'AIN',
      network: ainBlockchainNetwork[stage],
      appId,
      collectionId,
      symbol,
      name,
      tokenUpdatePermission: {
        collectionOwner: true,
        tokenOwner: true
      },
    });
    console.log(JSON.stringify(res, null, 2));
  } catch (error) {
    console.error(error);
  }

}

const usage = () => {
  console.log('\nUsage: node create-new-collection.js <DEV | PROD> <APP ID> <COLLECTION_ID> <SYMBOL> <NAME> <PRIVATE KEY>\n');
  console.log('<DEV | PROD>: It means stage. dev connects to testnet, prod connects to mainnet.');
  console.log('<APP ID>: This is the app id to create on the ainft server.' +
    'Combinations of lowercase letters, underscores and number are allowed.');
  console.log('<COLLECTION ID>');
  console.log('<SYMBOL>');
  console.log('<NAME>');
  console.log('<PRIVATE KEY>: It means ain blockchain private key. You must have the access key to use the APIs of the AINFT server.\n')
  console.log('Example: node create-ainft-server-app.js DEV new_app myUserId ' +
    '50f561d8a2083d325973bac01b313b05d0466f9e786cb3cb7350b8d2eed7b383');
  process.exit(0);
}

main();