export const DEV_ENVRONMENT = process.env.DEV_ENVIRONMENT || null;
export const ENDPOINT = DEV_ENVRONMENT ?
    'https://ainft-api-dev.ainetwork.ai' :
    'https://ainft-api.ainetwork.ai';
