import { AinftError } from '../error';
import { EnvType } from '../types';

let env: EnvType | null;

export const getEnv = () => {
  if (!env) {
    throw new AinftError('bad-request', 'env is not defined. please call setEnv() first.');
  }
  return env;
};

export const setEnv = (value: EnvType) => {
  env = value;
};
