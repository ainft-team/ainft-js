const AinftJs = require('@ainft-team/ainft-js').default;
const { privateKey } = require('../config.json');

const ainft = new AinftJs({
  privateKey,
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

const searchAinftObjects = async () => {
  const filter = {
    ainftObjectId: '',
    userAddress: '',
    name: '',
    symbol: '',
    limit: 0,
    cursor: '',
  };
  ainft.nft
    .searchAinftObjects(filter)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

const searchNfts = async () => {
  const filter = {
    ainftObjectId: '',
    userAddress: '',
    tokenId: '',
    name: '',
    symbol: '',
    limit: 0,
    cursor: '',
  };
  ainft.nft
    .searchNfts(filter)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

searchNfts();
