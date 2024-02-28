export const NODE_ENV = process.env.NODE_ENV;

export const AINFT_SERVER_ENDPOINT = {
  dev: 'https://ainft-api-dev.ainetwork.ai',
  prod: 'https://ainft-api.ainetwork.ai',
}

export const AIN_BLOCKCHAIN_ENDPOINT = {
  dev: 'https://testnet-api.ainetwork.ai',
  prod: 'https://mainnet-api.ainetwork.ai',
}


export const AIN_BLOCKCHAIN_CHAINID = {
  dev: 0,
  prod: 1
}

export const MIN_GAS_PRICE = 500;
export const APP_STAKING_LOCKUP_DURATION_MS = 30 * 1000 // 30 seconds

export const SUPPORTED_AINFT_STANDARDS = {
  721: '721',
}

export const SERVICE_NAME_MAP = new Map<string, string>([
  ['openai', 'ainize_openai']
]);
