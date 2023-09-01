import FactoryBase from "./factoryBase";
import { ActivityNftInfo, AiHistoryData, HttpMethod, NftActivityType, TaskTypeCategory } from "./types";

export default class Activity extends FactoryBase {
  /**
   * You can add activity without event. Just add activity.
   * @param appId 
   * @param userId 
   * @param data 
   * @param activityType 
   * @param nftInfo 
   */
  add(
    appId: string,
    userId: string,
    data: any,
    activityType: TaskTypeCategory | NftActivityType,
    nftInfo?: ActivityNftInfo
  ) {
    const body = {
      appId,
      userId,
      data,
      activityType,
      nftInfo,
    };
    const trailingUrl = '';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Add activity history under nft path.
   * @param {string} nftId 
   * @param {string} tokenId 
   * @param {string} userAddress 
   * @param {any} data 
   * @param {NftActivityType | TaskTypeCategory} activityType 
   * @param {string} activityId - If you have any activityId, you can use it.
   * @returns 
   */
  async addNftActivty(nftId: string, tokenId: string, userAddress: string, data: any, activityType: NftActivityType | TaskTypeCategory, activityId?: string) {
    const signerAddress = this.ain.signer.getAddress();
    const txBody = await this.getTxBodyForAddNftActivity(nftId, tokenId, userAddress, data, signerAddress, activityType, activityId);
    return this.ain.sendTransaction(txBody);
  }
  
  getTxBodyForAddNftActivity(nftId: string, tokenId: string, userAddress: string, data: any, signerAddress: string, activityType: NftActivityType | TaskTypeCategory, activityId?: string) {
    const body = { nftId, tokenId, userAddress, data, signerAddress, activityType, activityId };
    const trailingUrl = '/nft';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * You can update the record of one activity with NFT. record can be a statistic or count value from activity.
   * @param nftId
   * @param tokenId
   * @param label Record label. Record data is recorded under the label.
   * @param data
   */
  async addNftRecord(
    nftId: string,
    tokenId: string,
    label: string,
    data: any
  ) {
    const signerAddress = this.ain.signer.getAddress();
    const txBody = await this.getTxBodyForAddNftRecord(nftId, tokenId, label, data, signerAddress);
    return this.ain.sendTransaction(txBody);
  }

  getTxBodyForAddNftRecord(nftId: string, tokenId: string, label: string, data: string, signerAddress: string) {
    const body = {
      nftId,
      tokenId,
      label,
      data,
      signerAddress
    }
    const trailingUrl = 'nft/record';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Add AI interaction history under nft path.
   * @param {string} nftId 
   * @param {string} tokenId 
   * @param {string} label 
   * @param {AiHistoryData} data - AI history data must include model name and result. 
   * @returns 
   */
  async addNftAiHistory(nftId: string, tokenId: string, label: string, data: AiHistoryData) {
    const address = this.ain.signer.getAddress();
    const txInput = await this.getTxBodyForAddNftAiHistory(nftId, tokenId, label, data, address);
    return this.ain.sendTransaction(txInput);
  }

  /**
   * Get transaction body to add ai interaction history with nft. Sending the transaction must be done manually.
   * @param {getTxbodyAddAiHistoryParams} getTxbodyAddAiHistoryParams
   * @returns 
   */
  getTxBodyForAddNftAiHistory(nftId: string, tokenId: string, label: string, data: AiHistoryData, signerAddress: string) {
    const body = {
      nftId,
      tokenId,
      label,
      data,
      signerAddress
    };
    const trailingUrl = 'nft/ai_history';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
