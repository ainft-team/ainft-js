export const NODE_ENV = process.env.NODE_ENV;
export const AINFT_SERVER_ENDPOINT = NODE_ENV === 'prod' ?
  'https://ainft-api.ainetwork.ai':
  'https://ainft-api-dev.ainetwork.ai';

export const AIN_BLOCKCHAIN_ENDPOINT = NODE_ENV === 'prod'
  ? 'https://mainnet-api.ainetwork.ai'
  : 'https://testnet-api.aientwork.ai';

export const AIN_BLOCKCHAIN_CHAINID = NODE_ENV === 'prod' ? 1 : 0;

export const INITIALIZE_STAKE_AMOUNT = 500;
