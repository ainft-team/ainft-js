import AinftBase from "./ainftBase";
import { HttpMethod, NftActivityType, TaskTypeCategory } from "./types";

export default class Activity extends AinftBase {
  add(
    appId: string,
    userId: string,
    data: any,
    activityType: TaskTypeCategory | NftActivityType,
    nftInfo: {
      contractAddress: string;
      tokenId: string;
      userAddress: string;
      chain: string;
    }
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
    nftInfo: {
      contractAddress: string;
      tokenId: string;
      chain: string;
    },
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