import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import ChatAi from './chatAi';

export default class Ai {
  private ain: Ain;
  private ainize: Ainize;
  chat: ChatAi;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
    this.chat = new ChatAi(ain, ainize);
  }
}
