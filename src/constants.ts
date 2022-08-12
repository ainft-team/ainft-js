export const NODE_ENV = process.env.NODE_ENV;
export const ENDPOINT = NODE_ENV === 'prod' ?
  'https://ainft-api.ainetwork.ai':
  'https://ainft-api-dev.ainetwork.ai';
