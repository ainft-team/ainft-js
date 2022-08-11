import axios from 'axios';

import { ENDPOINT } from './constants';

export async function getStatus() {
  return (await axios.get(`${ENDPOINT}/status`)).data;
};
