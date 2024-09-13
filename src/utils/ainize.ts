import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Service from '@ainize-team/ainize-js/dist/service';
import Handler from '@ainize-team/ainize-js/dist/handlers/handler';
import { DEFAULT_AINIZE_SERVICE_NAME } from '../constants';
import { AinftError } from '../error';

const DEFAULT_TIMEOUT_MS = 60 * 1000; // 1min

export const getService = async (ainize: Ainize, name: string): Promise<Service> => {
  const server = await ainize.getService(name);
  const isRunning = await server.isRunning();
  if (!isRunning) {
    throw new AinftError('unavailable', `service ${name} is not running.`);
  }
  return server;
};

export const getServiceName = () => {
  return DEFAULT_AINIZE_SERVICE_NAME;
};

export const request = async <T>(
  ainize: Ainize,
  { serviceName, opType, data, timeout = DEFAULT_TIMEOUT_MS }: AinizeRequest
): Promise<AinizeResponse<T>> => {
  if (!Handler.getInstance().isConnected()) {
    // NOTE(jiyoung): client error handling method need to be updated.
    throw new AinftError('unavailable', 'connection to the blockchain network could not be established.');
  }

  let timer;
  const startTimer = new Promise(
    (reject) => (timer = setTimeout(() => reject(`timeout of ${timeout}ms exceeded`), timeout))
  );

  const server = await getService(ainize, serviceName);
  try {
    const response = await Promise.race([server.request({ ...data, jobType: opType }), startTimer]);
    if (response.status === AinizeStatus.FAIL) {
      throw new AinftError('internal', JSON.stringify(response.data));
    }
    return response as AinizeResponse<T>;
  } catch (error: any) {
    throw new AinftError('internal', `failed to ${opType}: ${error.message}`);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

export interface AinizeRequest {
  serviceName: string;
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
  SEND_MESSAGE = 'send_message',

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
