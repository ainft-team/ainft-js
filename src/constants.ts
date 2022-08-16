export const NODE_ENV = process.env.NODE_ENV;
export const ENDPOINT = NODE_ENV === 'prod' ?
  'https://ainft-api.ainetwork.ai':
  'https://ainft-api-dev.ainetwork.ai';

export const BLOCKCHAIN_ENDPOINT = NODE_ENV === 'prod'
  ? 'https://mainnet-api.ainetwork.ai'
  : 'https://testnet-api.aientwork.ai';

export const BLOCKCHAIN_CHAINID = NODE_ENV === 'prod' ? 1 : 0;
