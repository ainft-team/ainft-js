import AinftBase from './ainftBase';
import {
  HttpMethod,
  TextToArtResponse,
  TextToArtParams,
  TextToArtTxHash,
} from './types';

export default class TextToArt extends AinftBase {
  /**
   * Get result of a text to art task.
   * @param {appId} appId where uses text to art
   * @param {taskId} taskId
   * @returns {Promise<TextToArtResponse | null>} Return text to art results or null.
   */
  getTextToArtResults(appId: string, taskId: string): Promise<TextToArtResponse | null> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/images`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get request parameters used for a text to art task.
   * @param {appId} appId
   * @param {taskId} taskId
   * @returns {Promise<TextToArtParams | null>} Return request parameters used for a text to art task or null.
   */
  getTextToArtParams(appId: string, taskId: string): Promise<TextToArtParams | null> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/params`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get transation hash for tasks of a text to art task.
   * @param {appId} appId
   * @param {taskId} taskId of 
   * @returns {Promise<TextToArtTxHash | null>} Return transation hash for tasks of a text to art task or null.
   */
  getTextToArtTxHash(appId: string, taskId: string): Promise<TextToArtTxHash | null> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/tx-hash`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
 * Post request to generate image.
 * @param {appId} appId
 * @param {discord} discord
 * @param {TextToArtParams} params
 */
  generateImage(appId: string, discord: {
    user_id: string;
    guild_id: string;
    channel_id: string;
    message_id: string;
  }, params: TextToArtParams) {
    const data = {
      appId,
      discord,
      params
    }
    const trailingUrl = 'generate';
    return this.sendRequest(HttpMethod.POST, trailingUrl, data);
  }
}
