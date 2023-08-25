const AinftJs = require('@ainft-team/ainft-js').default;

const ainftServerEndpoint = {
  DEV: 'https://ainft-api-dev.ainetwork.ai',
  PROD: 'https://ainft-api.ainetwork.ai',
}

const main = async () => {
  if (process.argv.length !== 6) {
    usage();
  }

  const stage = process.argv[2];
  const name = process.argv[3];
  const symbol = process.argv[4];
  const privateKey = process.argv[5];

  if (stage !== 'DEV' && stage !== 'PROD') {
    console.log('stage must be in DEV or PROD.');
    return;
  }

  const ainftJs = new AinftJs(
    privateKey,
    ainftServerEndpoint[stage],
  );
  
  try {
    const myNft = await ainftJs.nft.create(name, symbol);
    console.log(JSON.stringify(myNft, null, 2));
  } catch (error) {
    console.error(error);
  }

}

const usage = () => {
  console.log('\nUsage: node create-new-collection.js <DEV | PROD> <APP ID> <COLLECTION_ID> <SYMBOL> <NAME> <PRIVATE KEY>\n');
  console.log('<DEV | PROD>: It means stage. dev connects to testnet, prod connects to mainnet.');
  console.log('<NAME>');
  console.log('<SYMBOL>');
  console.log('<PRIVATE KEY>: It means ain blockchain private key. You must have the access key to use the APIs of the AINFT server.\n')
  console.log('Example: node create-ainft-server-app.js DEV [name] [symbol] ' +
    '50f561d8a2083d325973bac01b313b05d0466f9e786cb3cb7350b8d2eed7b383');
  process.exit(0);
}

main();