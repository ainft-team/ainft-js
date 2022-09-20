import axios from 'axios';
import AinftBase from './ainftBase';
import { HttpMethod, ItemTryOnParams, PurchaseHistory, StoreItem, StorePurchaseParams, UserItem } from './types';
import { buildData } from './util';

export default class Store extends AinftBase {

  getStoreItemList(appId: string, storeId: string): Promise<StoreItem[]> {
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(
      HttpMethod.GET,
      `/store/${storeId}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${storeId}`, {
        params: query,
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getUserInventory(appId: string, userId: string): Promise<UserItem[]> {
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(
      HttpMethod.GET,
      `/store/inventory/${userId}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/inventory/${userId}`, {
        params: query,
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getStoreItemInfo(appId: string, storeId: string, itemName: string): Promise<StoreItem> {
    const encodedItemName = encodeURIComponent(itemName);
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(
      HttpMethod.GET,
      `/store/${storeId}/item/${encodedItemName}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/${storeId}/item/${encodedItemName}`, {
        params: query,
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  getUserItemInfo(appId: string, userId: string, itemName: string): Promise<UserItem> {
    const encodedItemName = encodeURIComponent(itemName);
    const timestamp = Date.now();
    const query = { appId };
    const data = buildData(
      HttpMethod.GET,
      `/store/inventory/${userId}/item/${encodedItemName}`,
      timestamp,
      query
    );
    const signature = this.signData(data);
    return axios
      .get(`${this.baseUrl}/inventory/${userId}/item/${encodedItemName}`, {
        params: query,
        headers: {
          'X-AINFT-Date': timestamp,
          Authorization: `AINFT ${signature}`,
        },
      })
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }

  purchaseStoreItem({
    appId,
    storeId,
    userId,
    itemName,
    quantity,
  }: StorePurchaseParams): Promise<PurchaseHistory> {
    const encodedItemName = encodeURIComponent(itemName);
    const timestamp = Date.now();
    const body = {
      appId,
      userId,
      quantity,
    };
    const data = buildData(
      HttpMethod.POST,
      `/store/${storeId}/item/${encodedItemName}/purchase`,
      timestamp,
      body
    );
    const signature = this.signData(data);
    return axios
      .post(
        `${this.baseUrl}/${storeId}/item/${encodedItemName}/purchase`,
        body,
        {
          headers: {
            'X-AINFT-Date': timestamp,
            Authorization: `AINFT ${signature}`,
          },
        }
      )
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
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
    const timestamp = Date.now();
    const body = {
      appId,
      userId,
      chain,
      nftContractAddress,
      nftTokenId,
    };
    const data = buildData(
      HttpMethod.POST,
      `/store/${storeId}/item/${encodedItemName}/try-on`,
      timestamp,
      body
    );
    const signature = this.signData(data);
    return axios
      .post(
        `${this.baseUrl}/${storeId}/item/${encodedItemName}/try-on`,
        body,
        {
          headers: {
            'X-AINFT-Date': timestamp,
            Authorization: `AINFT ${signature}`,
          },
        }
      )
      .then((res) => res.data.data)
      .catch((e) => {
        throw e.response.data;
      });
  }
}
