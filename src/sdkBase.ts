import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

export default class SdkBase {
  protected ain: Ain;
  protected ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }
}
