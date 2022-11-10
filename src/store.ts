import AinftBase from './ainftBase';
import {
  HttpMethod,
  ItemTryOnParams,
  ItemUseParams,
  PurchaseHistory,
  StoreItem,
  StorePurchaseParams,
  UserItem,
  CreateItemParams,
  UpdateItemParams,
  RegisterItemParams,
  UpdateStoreItemParams,
} from './types';

export default class Store extends AinftBase {
  createItem({
    appId,
    type,
    subtype,
    value,
    description,
    name,
    image,
    quantity,
  }: CreateItemParams) {
    const body = {
      appId,
      type,
      subtype,
      value,
      description,
      name,
      image,
      quantity,
    };
    const trailingUrl = 'item';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  updateItem({
    appId,
    itemName,
    name,
    image,
    description,
    quantity,
  }: UpdateItemParams) {
    const body = { appId, name, image, description, quantity };
    const trailingUrl = `item/${encodeURIComponent(itemName)}`;
    return this.sendRequest(HttpMethod.PUT, trailingUrl, body);
  }

  deregisterItemFromAllStore(appId: string, type: string, subtype: string, value: string) {
    const query = { appId, type, subtype, value };
    const trailingUrl = 'item';
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  registerItem({
    appId,
    storeId,
    itemName,
    seller,
    quantity,
    price,
    currency,
    saleStartAt,
    saleEndAt,
    maxPurchasePerUser,
  }: RegisterItemParams) {
    const body = {
      appId,
      seller,
      quantity,
      price,
      currency,
      saleStartAt,
      saleEndAt,
      maxPurchasePerUser,
    };
    const trailingUrl = `${storeId}/item/${encodeURIComponent(itemName)}/sell`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  deregisterItem(appId: string, storeId: string, itemName: string) {
    const query = { appId };
    const trailingUrl = `${storeId}/item/${encodeURIComponent(itemName)}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  updateStoreItem({
    appId,
    storeId,
    itemName,
    price,
    quantity,
    status,
    saleStartAt,
    saleEndAt,
    maxPurchasePerUser,
  }: UpdateStoreItemParams) {
    const body = {
      appId,
      price,
      quantity,
      status,
      saleEndAt,
      saleStartAt,
      maxPurchasePerUser,
    };
    const trailingUrl = `${storeId}/item/${encodeURIComponent(itemName)}`;
    return this.sendRequest(HttpMethod.PUT, trailingUrl, body);
  }

  getStoreItemList(appId: string, storeId: string): Promise<StoreItem[]> {
    const query = { appId };
    const trailingUrl = `${storeId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getUserInventory(appId: string, userId: string): Promise<UserItem[]> {
    const query = { appId };
    const trailingUrl = `inventory/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getStoreItemInfo(
    appId: string,
    storeId: string,
    itemName: string
  ): Promise<StoreItem> {
    const encodedItemName = encodeURIComponent(itemName);
    const query = { appId };
    const trailingUrl = `${storeId}/item/${encodedItemName}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getUserItemInfo(
    appId: string,
    userId: string,
    itemName: string
  ): Promise<UserItem> {
    const encodedItemName = encodeURIComponent(itemName);
    const query = { appId };
    const trailingUrl = `inventory/${userId}/item/${encodedItemName}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
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
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
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
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  useItem({
    appId,
    userId,
    itemName,
    quantity,
    params,
  }: ItemUseParams): Promise<void> {
    const encodedItemName = encodeURIComponent(itemName);
    const body = {
      appId,
      quantity,
      ...params && { params },
    };
    const trailingUrl = `inventory/${userId}/item/${encodedItemName}/use`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
