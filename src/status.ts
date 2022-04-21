import axios from 'axios';

export async function getStatus() {
  return axios.get('https://ainft-api-dev.ainetwork.ai/status');
}