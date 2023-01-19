import AinftBase from "./ainftBase";
import { ActivityNftInfo, HttpMethod, NftActivityType, TaskTypeCategory } from "./types";

export default class Activity extends AinftBase {
  add(
    appId: string,
    userId: string,
    data: any,
    activityType: TaskTypeCategory | NftActivityType,
    nftInfo?: ActivityNftInfo,
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
    }
    const trailingUrl = 'nft/record';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}