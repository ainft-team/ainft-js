import SdkBase from '../sdkBase';
import Chat from './chat';

export default class BaseAi extends SdkBase {
  chat: Chat = new Chat(this.ain, this.ainize);
}
