import { EnvType } from '../types';

let env: EnvType | null;

export const getEnv = () => {
  if (!env) {
    throw new Error("Env is not defined, use setEnv().");
  }
  return env;
};

export const setEnv = (value: EnvType) => {
  env = value;
};