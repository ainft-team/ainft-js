import axios from 'axios';

export async function getStatus() {
  return (await axios.get('https://ainft-api-dev.ainetwork.ai/status')).data;
}