import SdkBase from '../sdkBase';
import ChatAi from './chatAi';

export default class BaseAi extends SdkBase {
  chat: ChatAi = new ChatAi(this.ain, this.ainize);
}
