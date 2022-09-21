import axios from 'axios';
import AinftBase from './ainftBase';
import { HttpMethod, ItemTryOnParams, PurchaseHistory, StoreItem, StorePurchaseParams, UserItem } from './types';
import { buildData } from './util';

const prefix = 'store';
export default class Store extends AinftBase {

  getStoreItemList(appId: string, storeId: string): Promise<StoreItem[]> {
    const query = { appId };
    const trailingUrl = `${storeId}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  getUserInventory(appId: string, userId: string): Promise<UserItem[]> {
    const query = { appId };
    const trailingUrl = `inventory/${userId}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  getStoreItemInfo(appId: string, storeId: string, itemName: string): Promise<StoreItem> {
    const encodedItemName = encodeURIComponent(itemName);
    const query = { appId };
    const trailingUrl = `${storeId}/item/${encodedItemName}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  getUserItemInfo(appId: string, userId: string, itemName: string): Promise<UserItem> {
    const encodedItemName = encodeURIComponent(itemName);
    const query = { appId };
    const trailingUrl = `inventory/${userId}/item/${encodedItemName}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  purchaseStoreItem({
    appId,
    storeId,
    userId,
    itemName,
    quantity,
  }: StorePurchaseParams): Promise<PurchaseHistory> {
    const encodedItemName = encodeURIComponent(itemName);
    const body = {
      appId,
      userId,
      quantity,
    };
    const trailingUrl = `${storeId}/item/${encodedItemName}/purchase`;
    return this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  tryOnItem({
    appId,
    userId,
    storeId,
    itemName,
    chain,
    nftContractAddress,
    nftTokenId,
  }: ItemTryOnParams): Promise<string> {
    const encodedItemName = encodeURIComponent(itemName);
    const body = {
      appId,
      userId,
      chain,
      nftContractAddress,
      nftTokenId,
    };
    const trailingUrl = `${storeId}/item/${encodedItemName}/try-on`;
    return this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }
}
