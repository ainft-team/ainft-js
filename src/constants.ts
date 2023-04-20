export const NODE_ENV = process.env.NODE_ENV;
export const AINFT_SERVER_ENDPOINT = NODE_ENV === 'prod' ?
  'https://ainft-api.ainetwork.ai':
  'https://ainft-api-dev.ainetwork.ai';

export const AIN_BLOCKCHAIN_ENDPOINT = NODE_ENV === 'prod'
  ? 'https://mainnet-api.ainetwork.ai'
  : 'https://testnet-api.aientwork.ai';

export const AIN_BLOCKCHAIN_CHAINID = NODE_ENV === 'prod' ? 1 : 0;

export const MIN_GAS_PRICE = 500;

export const ETH_NETWORKS: { [chain: string]: string } = {
  HOMESTEAD: 'homestead',
  GOERLI: 'goerli',
};
export const SUPPORTED_CHAINS: { [chain: string]: string } = {
  ETH: 'ETH',
};
export const SUPPORTED_NETWORKS: { [chain: string]: Array<string> } = {
  ETH: [ETH_NETWORKS.HOMESTEAD, ETH_NETWORKS.GOERLI],
};
export const DEFAULT_NETWORK: { [chain: string]: string } = {
  ETH: ETH_NETWORKS.HOMESTEAD,
};
