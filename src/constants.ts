export const NODE_ENV = process.env.NODE_ENV;

export const AINFT_SERVER_ENDPOINT = {
  dev: 'https://ainft-api-dev.ainetwork.ai',
  prod: 'https://ainft-api.ainetwork.ai',
};

export const AIN_BLOCKCHAIN_ENDPOINT = {
  dev: 'https://testnet-api.ainetwork.ai',
  prod: 'https://mainnet-api.ainetwork.ai',
};

export const AIN_BLOCKCHAIN_CHAIN_ID = { dev: 0, prod: 1 } as const;

export const MIN_GAS_PRICE = 500;
export const APP_STAKING_LOCKUP_DURATION_MS = 30 * 1000; // 30sec
export const TX_BYTES_LIMIT = 100000; // 100kb

export const SUPPORTED_AINFT_STANDARDS = {
  721: '721',
};

export const THREAD_GC_MAX_SIBLINGS = 20;
export const THREAD_GC_NUM_SIBLINGS_DELETED = 10;
export const MESSAGE_GC_MAX_SIBLINGS = 15;
export const MESSAGE_GC_NUM_SIBLINGS_DELETED = 10;

export const DEFAULT_AINIZE_SERVICE_NAME = 'openai_backend';

export const WHITELISTED_OBJECT_IDS: Record<string, string[]> = {
  dev: [
    '0xCE3c4D8dA38c77dEC4ca99cD26B1C4BF116FC401', // aina
  ],
  prod: [],
};
