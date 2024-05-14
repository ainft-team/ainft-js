import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Service from '@ainize-team/ainize-js/dist/service';
import { DEFAULT_AINIZE_SERVER_NAME } from './constants';

const DEFAULT_TIMEOUT_MS = 60 * 1000; // 1min

export const getServer = async (ainize: Ainize, name: string): Promise<Service> => {
  const server = await ainize.getService(name);
  const isRunning = await server.isRunning();
  if (!isRunning) {
    throw new Error(`${name} is not running.`);
  }
  return server;
};

export const getServerName = () => {
  return DEFAULT_AINIZE_SERVER_NAME;
};

export const request = async <T>(
  ainize: Ainize,
  { serverName, opType, data, timeout = DEFAULT_TIMEOUT_MS }: AinizeRequest
): Promise<AinizeResponse<T>> => {
  let timer;
  const startTimer = new Promise(
    (reject) => (timer = setTimeout(() => reject(`timeout of ${timeout}ms exceeded`), timeout))
  );
  const server = await getServer(ainize, serverName);
  try {
    const response = await Promise.race([server.request({ ...data, jobType: opType }), startTimer]);
    if (response.status === AinizeStatus.FAIL) {
      throw new Error(JSON.stringify(response.data));
    }
    return response as AinizeResponse<T>;
  } catch (error: any) {
    throw new Error(`Failed to request ${opType}: ${error.message}`);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

export interface AinizeRequest {
  serverName: string;
  opType: OperationType;
  data?: any;
  timeout?: number;
}

export interface AinizeResponse<T = any> {
  data: T;
  status: AinizeStatus;
}

export enum AinizeStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export enum OperationType {
  CREATE_ASSISTANT = 'create_assistant',
  LIST_ASSISTANTS = 'list_assistants',
  RETRIEVE_ASSISTANT = 'retrieve_assistant',
  MODIFY_ASSISTANT = 'modify_assistant',
  DELETE_ASSISTANT = 'delete_assistant',
  MINT_CREATE_ASSISTANT = 'mint_create_assistant',

  CREATE_THREAD = 'create_thread',
  LIST_THREADS = 'list_threads',
  RETRIEVE_THREAD = 'retrieve_thread',
  MODIFY_THREAD = 'modify_thread',
  DELETE_THREAD = 'delete_thread',
  CREATE_RUN_THREAD = 'create_run_thread',

  CREATE_MESSAGE = 'create_message',
  LIST_MESSAGES = 'list_messages',
  RETRIEVE_MESSAGE = 'retrieve_message',
  MODIFY_MESSAGE = 'modify_message',

  CREATE_RUN = 'create_run',
  LIST_RUNS = 'list_runs',
  LIST_RUN_STEPS = 'list_run_steps',
  RETRIEVE_RUN = 'retrieve_run',
  RETRIEVE_RUN_STEP = 'retrieve_run_step',
  MODIFY_RUN = 'modify_run',
  CANCEL_RUN = 'cancel_run',

  CREATE_USER = 'create_user',
  GET_CREDIT = 'get_credit',
  MINT_TOKEN = 'mint_token',
}
