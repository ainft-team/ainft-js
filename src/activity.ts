import AinftBase from "./ainftBase";
import { ActivityNftInfo, AddAiHistoryParams, HttpMethod, NftActivityType, TaskTypeCategory, getTxbodyAddAiHistoryParams } from "./types";

export default class Activity extends AinftBase {
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
   * You can update the record of one activity with NFT. record can be a statistic or count value from activity.
   * @param appId
   * @param userId
   * @param nftInfo
   * @param label Record label. Record data is recorded under the label.
   * @param data
   */
  addNftRecord(
    appId: string,
    userId: string,
    nftInfo: ActivityNftInfo,
    label: string,
    data: any
  ) {
    const body = {
      appId,
      userId,
      nftInfo,
      label,
      data,
    };
    const trailingUrl = 'nft/record';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Add ai interaction history with nft.
   * @param {AddAiHistoryParams} AddAiHistoryParams
   * @returns 
   */
  async addNftAiHistory({
    chain,
    network,
    appId,
    collectionId,
    tokenId,
    data,
    label,
  }: AddAiHistoryParams) {
    // TODO: this.ain.signer.getAddress();
    const address = await this.ain.wallet.defaultAccount?.address!;
    const txInput = await this.getTxBodyForAddNftAiHistory({
      chain,
      network,
      appId,
      collectionId,
      tokenId,
      data,
      label,
      address,
    });
    return this.ain.sendTransaction(txInput);
  }

  /**
   * Get transaction body to add ai interaction history with nft. Sending the transaction must be done manually.
   * @param {getTxbodyAddAiHistoryParams} getTxbodyAddAiHistoryParams
   * @returns 
   */
  getTxBodyForAddNftAiHistory({
    chain,
    network,
    appId,
    collectionId,
    tokenId,
    data,
    address,
    label,
  }: getTxbodyAddAiHistoryParams) {
    const body = {
      chain,
      network,
      appId,
      collectionId,
      tokenId,
      historyData: data,
      label,
      address,
    };
    const trailingUrl = 'nft/ai_history';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
