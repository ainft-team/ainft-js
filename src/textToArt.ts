import FactoryBase from './factoryBase';
import {
  HttpMethod,
  Task,
  TextToArtResponse,
  TextToArtParams,
  TextToArtTxHash,
  DiscordMessageInfo,
} from './types';

export default class TextToArt extends FactoryBase {
  /**
   * Get the result of a text-to-art task.
   * @param {string} appId - The ID of the app where the text-to-art task will be used.
   * @param {string} taskId - The ID of the text-to-art task.
   * @returns {Promise<TextToArtResponse | null>} - A promise that resolves with the text-to-art results or null.
   */
  getTextToArtResults(appId: string, taskId: string): Promise<TextToArtResponse | null> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/images`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get the request parameters used for a text-to-art task.
   * @param {string} appId - The ID of the app where the text-to-art task will be used.
   * @param {string} taskId - The ID of the text-to-art task.
   * @returns {Promise<TextToArtParams | null>} - A promise that resolves with the request parameters used for the text-to-art task or null.
   */
  getTextToArtParams(appId: string, taskId: string): Promise<TextToArtParams | null> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/params`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Get the transaction hash for a text-to-art task.
   * @param {string} appId - The ID of the app where the text-to-art task will be used.
   * @param {string} taskId - The ID of the text-to-art task.
   * @returns {Promise<TextToArtTxHash | null>} - A promise that resolves with the transaction hash for the task or null.
   */
  getTextToArtTxHash(appId: string, taskId: string): Promise<TextToArtTxHash | null> {
    const query = {
      appId,
    };
    const trailingUrl = `tasks/${taskId}/tx-hash`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Post a request to generate an image.
   * @param {string} appId - The ID of the app where the text-to-art task will be used.
   * @param {DiscordMessageInfo} discord - The Discord object that contains the IDs of the user, guild, channel, and message.
   * @param {TextToArtParams} params - The request parameters used for the text-to-art task.
   * @returns {Promise<Task | null>} - A promise that resolves with the task id for the task or null.
   */
  generateImage(appId: string, discord: DiscordMessageInfo, params: TextToArtParams) {
    const body = {
      appId,
      discord,
      params
    }
    const trailingUrl = 'generate';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
