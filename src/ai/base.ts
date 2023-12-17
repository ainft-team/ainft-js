import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import Chat from './chat';

export default class BaseAi {
  chat: Chat;
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.chat = new Chat(ain, ainize);
    this.ain = ain;
    this.ainize = ainize;
  }
}
