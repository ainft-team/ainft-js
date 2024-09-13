import Ain from '@ainblockchain/ain-js';
import AinftObject from '../ainft721Object';
import { MessageMap } from '../types';
import { Path } from './path';
import { valueExists, getValue } from './util';
import { AinftError } from '../error';

export const isObjectOwner = async (ain: Ain, objectId: string, address: string) => {
  const appId = AinftObject.getAppId(objectId);
  const objectOwnerPath = `apps/${appId}/owner`;
  const objectOwner = await getValue(ain, objectOwnerPath);
  return address === objectOwner;
};

export const validateObject = async (ain: Ain, objectId: string) => {
  const appId = AinftObject.getAppId(objectId);
  const objectPath = Path.app(appId).value();
  const object = await getValue(ain, objectPath, { is_shallow: true });
  if (!object) {
    throw new AinftError('not-found', `object not found: ${objectId}`);
  }
};

export const validateServerConfigurationForObject = async (
  ain: Ain,
  objectId: string,
  serviceName: string
) => {
  const appId = AinftObject.getAppId(objectId);
  const configPath = Path.app(appId).ai(serviceName).value();
  if (!(await valueExists(ain, configPath))) {
    throw new AinftError(
      'precondition-failed',
      `service configuration is missing for ${objectId}.`
    );
  }
};

export const validateObjectOwner = async (ain: Ain, objectId: string, address: string) => {
  if (!isObjectOwner(ain, objectId, address)) {
    throw new AinftError('permission-denied', `${address} do not have owner permission.`);
  }
};

export const validateToken = async (ain: Ain, objectId: string, tokenId: string) => {
  const appId = AinftObject.getAppId(objectId);
  const tokenPath = Path.app(appId).token(tokenId).value();
  if (!(await valueExists(ain, tokenPath))) {
    throw new AinftError('not-found', `token not found: ${objectId}(${tokenId})`);
  }
};

export const validateDuplicateAssistant = async (ain: Ain, objectId: string, tokenId: string) => {
  const appId = AinftObject.getAppId(objectId);
  const assistantPath = Path.app(appId).token(tokenId).ai().value();
  if (await valueExists(ain, assistantPath)) {
    throw new AinftError('already-exists', 'assistant already exists.');
  }
};

export const validateAssistant = async (
  ain: Ain,
  objectId: string,
  tokenId: string,
  assistantId?: string
) => {
  const appId = AinftObject.getAppId(objectId);
  const assistantPath = Path.app(appId).token(tokenId).ai().value();
  const assistant = await getValue(ain, assistantPath);
  if (!assistant) {
    throw new AinftError('not-found', `assistant not found: ${assistantId}`);
  }
  if (assistantId && assistantId !== assistant.id) {
    throw new AinftError('bad-request', `invalid assistant id: ${assistantId} != ${assistant.id}`);
  }
};

export const validateThread = async (
  ain: Ain,
  objectId: string,
  tokenId: string,
  address: string,
  threadId: string
) => {
  const appId = AinftObject.getAppId(objectId);
  const threadPath = Path.app(appId).token(tokenId).ai().history(address).thread(threadId).value();
  if (!(await valueExists(ain, threadPath))) {
    throw new AinftError('not-found', `thread not found: ${threadId}`);
  }
};

export const validateMessage = async (
  ain: Ain,
  objectId: string,
  tokenId: string,
  address: string,
  threadId: string,
  messageId: string
) => {
  const appId = AinftObject.getAppId(objectId);
  const messagesPath = Path.app(appId)
    .token(tokenId)
    .ai()
    .history(address)
    .thread(threadId)
    .messages()
    .value();
  const messages: MessageMap = await getValue(ain, messagesPath);
  // TODO(jiyoung): optimize inefficient loop.
  for (const key in messages) {
    if (messages[key].id === messageId) {
      return;
    }
  }
  throw new AinftError('not-found', `message not found: ${threadId}(${messageId})`);
};
