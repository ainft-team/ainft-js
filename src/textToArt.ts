import AinftBase from './ainftBase';
import {
  HttpMethod,
  TextToArtResponse,
  TextToArtParams,
  TextToArtTxHash,
} from './types';

export default class PersonaModels extends AinftBase {
  getTextToArtResults(
    appId: string,
    taskId: string
  ): Promise<TextToArtResponse> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/images`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getTextToArtParams(appId: string, taskId: string): Promise<TextToArtParams> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/params`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getTextToArtTxHash(appId: string, taskId: string): Promise<TextToArtTxHash> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/tx-hash`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
