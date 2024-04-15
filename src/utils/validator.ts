import Ain from '@ainblockchain/ain-js';
import AinftObject from '../ainft721Object';
import { MessageMap } from '../types';
import { Path } from './path';
import { exists, getValue } from './util';

export const isObjectOwner = async (ain: Ain, objectId: string, address: string) => {
  const appId = AinftObject.getAppId(objectId);
  const objectPath = Path.app(appId).value();
  const object = await getValue(objectPath, ain);
  return address === object.owner;
};

export const validateObject = async (ain: Ain, objectId: string) => {
  const appId = AinftObject.getAppId(objectId);
  const objectPath = Path.app(appId).value();
  if (!(await exists(objectPath, ain))) {
    throw new Error('Object not found');
  }
};

export const validateServerConfigurationForObject = async (
  ain: Ain,
  objectId: string,
  serverName: string
) => {
  const appId = AinftObject.getAppId(objectId);
  const configPath = Path.app(appId).ai(serverName).value();
  if (!(await exists(configPath, ain))) {
    throw new Error('Server configuration is missing for object');
  }
};

export const validateObjectOwner = async (ain: Ain, objectId: string, address: string) => {
  if (!isObjectOwner(ain, objectId, address)) {
    throw new Error(`${address} is not object owner`);
  }
};

export const validateToken = async (ain: Ain, objectId: string, tokenId: string) => {
  const appId = AinftObject.getAppId(objectId);
  const tokenPath = Path.app(appId).token(tokenId).value();
  if (!(await exists(tokenPath, ain))) {
    throw new Error('Token not found');
  }
};

export const validateDuplicateAssistant = async (ain: Ain, objectId: string, tokenId: string) => {
  const appId = AinftObject.getAppId(objectId);
  const assistantPath = Path.app(appId).token(tokenId).ai().value();
  if (await exists(assistantPath, ain)) {
    throw new Error('Assistant already exists');
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
  const assistant = await getValue(assistantPath, ain);
  if (!assistant) {
    throw new Error('Assistant not found');
  }
  if (assistantId !== null && assistantId !== assistant.id) {
    throw new Error('Invalid assistant id');
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
  if (!(await exists(threadPath, ain))) {
    throw new Error('Thread not found');
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
  const messagesPath = Path.app(appId).token(tokenId).ai().history(address).thread(threadId).messages().value();
  const messages: MessageMap = await getValue(messagesPath, ain);
  // TODO(jiyoung): optimize inefficient loop.
  for (const key in messages) {
    if (messages[key].id === messageId) {
      return;
    }
  }
  throw new Error('Message not found');
};
