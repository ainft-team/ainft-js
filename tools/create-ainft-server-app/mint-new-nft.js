const AinftJs = require('@ainft-team/ainft-js').default;

const ainftServerEndpoint = {
  DEV: 'https://ainft-api-dev.ainetwork.ai',
  PROD: 'https://ainft-api.ainetwork.ai',
}

const main = async () => {
  if (process.argv.length !== 10) {
    usage();
  }

  const stage = process.argv[2];
  const nftId = process.argv[3];
  const name = process.argv[4];
  const description = process.argv[5];
  const image = process.argv[6];
  const toAddress = process.argv[7];
  const tokenId = process.argv[8];
  const privateKey = process.argv[9];

  if (stage !== 'DEV' && stage !== 'PROD') {
    console.log('stage must be in DEV or PROD.');
    return;
  }

  const ainftJs = new AinftJs(
    privateKey,
    ainftServerEndpoint[stage],
  );
  
  try {
    const myNft = ainftJs.nft.getAinft721(nftId);
    const res = await myNft.mint(toAddress, tokenId);
    console.log('------ NFT mint');
    console.log(JSON.stringify(res, null, 2));

    await new Promise(resolve => setTimeout(resolve, 20000));

    const res2 = await ainftJs.nft.setNftMetadata({
      nftId, tokenId,
      metadata: {
        name,
        description,
        image
      }
    });
    console.log('------ NFT set metadata');
    console.log(JSON.stringify(res2, null, 2));
  } catch (error) {
    console.error(error);
  }

}

const usage = () => {
  console.log('\nUsage: node mint-new-nft.js\n');
  console.log('<DEV | PROD>: It means stage. dev connects to testnet, prod connects to mainnet.');
  console.log('<NAME>');
  console.log('<DESCRIPTION>');
  console.log('<IMAGE URL>');
  console.log('<TO ADDRESS>');
  console.log('<TOKEN ID>');
  console.log('<PRIVATE KEY>: It means ain blockchain private key. You must have the access key to use the APIs of the AINFT server.\n')
  console.log('Example: node create-ainft-server-app.js DEV new_app myUserId ' +
    '50f561d8a2083d325973bac01b313b05d0466f9e786cb3cb7350b8d2eed7b383');
  process.exit(0);
}

main();