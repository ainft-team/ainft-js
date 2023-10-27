import FactoryBase from "./factoryBase";
import { ActivityNftInfo, AddAiHistoryParams, HttpMethod, NftActivityType, TaskTypeCategory, getTxbodyAddAiHistoryParams } from "./types";

export default class Activity extends FactoryBase {
  /**
   * Add activity.
   * @param appId The ID of app.
   * @param userId The ID of user.
   * @param data Data related to the activity.
   * @param activityType The type of activity.
   * @param nftInfo Information about the NFTs used in the activity.
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
   * Adds a record accomplished with an NFT.
   * @param appId The ID of app.
   * @param userId The ID of user.
   * @param nftInfo Information about the NFTs used in the activity.
   * @param label The label of record.
   * @param data Data related to the activity.
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
   * Adds ai history with NFT.
   * @param {AddAiHistoryParams} AddAiHistoryParams The paramters to add ai history.
   * @returns 
   */
  async addNftAiHistory({
    chain,
    network,
    appId,
    ainftObjectId,
    tokenId,
    data,
    label,
  }: AddAiHistoryParams) {
    const userAddress = await this.ain.signer.getAddress();
    const txInput = await this.getTxBodyForAddNftAiHistory({
      chain,
      network,
      appId,
      ainftObjectId,
      tokenId,
      data,
      label,
      userAddress,
    });
    return this.ain.sendTransaction(txInput);
  }

  /**
   * Gets transaction body to add ai history with NFT.
   * Sending the transaction must be done manually.
   * @param {getTxbodyAddAiHistoryParams} getTxbodyAddAiHistoryParams
   * @returns Returns transaction body without signature.
   */
  getTxBodyForAddNftAiHistory({
    chain,
    network,
    appId,
    ainftObjectId,
    tokenId,
    data,
    userAddress,
    label,
  }: getTxbodyAddAiHistoryParams) {
    const body = {
      chain,
      network,
      appId,
      collectionId: ainftObjectId,
      tokenId,
      historyData: data,
      label,
      userAddress,
    };
    const trailingUrl = 'nft/ai_history';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
