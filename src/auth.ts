import AinftBase from './ainftBase';
import { HttpMethod, User } from './types';

const prefix = 'auth';
export default class Auth extends AinftBase {

  getUser(appId: string, userId: string): Promise<User> {
    const query = { appId };
    const trailingUrl = `user/${userId}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  addUserEthAddress(
    appId: string,
    userId: string,
    ethAddress: string
  ): Promise<User> {
    const body = {
      appId,
      ethAddress,
    };
    const trailingUrl = `user/${userId}/ethAddress`;
    return this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  removeUserEthAddress(
    appId: string,
    userId: string,
    ethAddress: string
  ): Promise<User> {
    const query = {
      appId,
      ethAddress,
    };
    const trailingUrl = `user/${userId}/ethAddress`;
    return this.sendRequest(HttpMethod.DELETE, prefix, trailingUrl, query);
  }
}
