import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import ChatAi from './chatAi';

export default class BaseAi {
  chat: ChatAi;
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
    this.chat = new ChatAi(ain, ainize);
  }
}
