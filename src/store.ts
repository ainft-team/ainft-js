import FactoryBase from './factoryBase';
import {
  HttpMethod,
  ItemTryOnParams,
  ItemUseParams,
  PurchaseHistory,
  ItemHistory,
  History,
  StoreItem,
  StorePurchaseParams,
  GetPurchaseHistoryParams,
  GetItemPurchaseHistoryParams,
  GetUserPurchaseHistoryParams,
  GetItemHistoryParams,
  GetSingleItemHistoryParams,
  GetUserItemHistoryParams,
  UserItem,
  CreateItemParams,
  UpdateItemParams,
  RegisterItemParams,
  UpdateStoreItemParams,
  NftMetadata,
  Item,
  ItemGiveHistory,
  itemType,
  UseItemReturnType,
} from './types';

/**
 * This class supports managing items, store and user items.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class Store extends FactoryBase {
  /**
   * Creates a new item.
   * @param {CreateItemParams} CreateItemParams - The parameters to create a new item.
   * @returns {Promise<Item>} Returns created item information.
   */
  createItem({
    appId,
    type,
    subtype,
    value,
    description,
    name,
    image,
    quantity,
    additionalInfo,
  }: CreateItemParams): Promise<Item> {
    const body = {
      appId,
      type,
      subtype,
      value,
      description,
      name,
      image,
      quantity,
      additionalInfo,
    };
    const trailingUrl = 'item';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Updates an item.
   * @param {UpdateItemParams} UpdateItemParams - The parameters to update an item.
   */
  updateItem({
    appId,
    itemName,
    name,
    image,
    description,
    quantity,
    additionalInfo,
  }: UpdateItemParams): Promise<void> {
    const body = {
      appId,
      name,
      image,
      description,
      quantity,
      additionalInfo,
    };
    const trailingUrl = `item/${encodeURIComponent(itemName)}`;
    return this.sendRequest(HttpMethod.PUT, trailingUrl, body);
  }

  /**
   * Deregisters an item from all stores.
   * @param {string} appId - The ID of the app.
   * @param {string} type - The type of the item.
   * @param {string} subtype - The subtype of the item.
   * @param {string} value - The value of the item.
   */
  deregisterItemFromAllStore(
    appId: string,
    type: string,
    subtype: string,
    value: string
  ): Promise<void> {
    const query = { appId, type, subtype, value };
    const trailingUrl = 'item';
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Registers an item in the store for selling.
   * @param {RegisterItemParams} RegisterItemParams - The parameters to register an item.
   * @returns {Promise<StoreItem>} Returns item information registered in the store.
   */
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
  }: RegisterItemParams): Promise<StoreItem> {
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

  /**
   * Deregisters an item from the store.
   * @param {string} appId - The ID of the app.
   * @param {string} storeId - The ID of the store.
   * @param {string} itemName - The name of the item.
   */
  deregisterItem(appId: string, storeId: string, itemName: string) {
    const query = { appId };
    const trailingUrl = `${storeId}/item/${encodeURIComponent(itemName)}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Gives item to user.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user who will receive the item.
   * @param {string} itemName The name of the item to give.
   * @param {string} quantity The quantity of the item to give.
   * @param {string=} reason The reason for giving an item. ex) Event for NFT holder
   * @returns {Promise<ItemGiveHistory>} Returns information of item give history.
   */
  giveItemToUser(
    appId: string,
    userId: string,
    itemName: string,
    quantity: number,
    reason?: string
  ): Promise<ItemGiveHistory> {
    const body = {
      appId,
      name: itemName,
      quantity,
      reason,
    };
    const trailingUrl = `inventory/${userId}/item`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Updates item in store.
   * @param {UpdateStoreItemParams} UpdateStoreItemParams - The parameters to update store item.
   */
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
  }: UpdateStoreItemParams): Promise<void> {
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

  /**
   * Returns a list of store items for a given app and store.
   * @param {string} appId - The ID of the app.
   * @param {string} storeId - The ID of the store.
   * @returns {Promise<StoreItem[]>} List of store items.
   */
  getStoreItemList(appId: string, storeId: string): Promise<StoreItem[]> {
    const query = { appId };
    const trailingUrl = `${storeId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Returns a list of user items for a given app and user.
   * @param {string} appId - The ID of the app.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<UserItem[]>} List of user items.
   */
  getUserInventory(appId: string, userId: string): Promise<UserItem[]> {
    const query = { appId };
    const trailingUrl = `inventory/${userId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Returns a list of all items created in the app. If type/subtype is given, returns only items of the given type/subtype.
   * @param {string} appId - The ID of the app.
   * @param {string} type - The type of the items to fetch.
   * @param {string} subtype - The subtype of the items to fetch.
   * @returns {Promise<Item[]>} List of items.
   */
  getAllItems(appId: string, type?: string, subtype?: string): Promise<Item[]> {
    const query = { appId, type, subtype };
    const trailingUrl = `items`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Returns information about a specific store item for a given app and store.
   * @param {string} appId - The ID of the app.
   * @param {string} storeId - The ID of the store.
   * @param {string} itemName - The name of the item to fetch.
   * @returns {Promise<StoreItem>} Information about the store item.
   */
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

  /**
   * Returns information about a specific user item for a given app and user.
   * @param {string} appId - The ID of the app.
   * @param {string} userId - The ID of the user.
   * @param {string} itemName - The name of the item to fetch.
   * @returns {Promise<UserItem>} Information about the user item.
   */
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

  /**
   * Purchases a store item.
   * @param {StorePurchaseParams} StorePurchaseParams - The purchase parameters.
   * @returns {Promise<PurchaseHistory>} Returns purchase history.
   */
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

  /**
   * Retrieves the purchase history of all items of an app.
   * @param {GetPurchaseHistoryParams} GetPurchaseHistoryParams - The parameters for the request.
   * @returns {Promise<History<PurchaseHistory>>} - A Promise that resolves to an object containing the purchase history.
   */
  getPurchaseHistory({
    appId,
    year,
    month,
    day,
  }: GetPurchaseHistoryParams): Promise<History<PurchaseHistory>> {
    const query = { appId };
    let trailingUrl = `purchaseHistory/`;
    if (year) trailingUrl += `${year}/`;
    if (year && month) trailingUrl += `${month}/`;
    if (year && month && day) trailingUrl += `${day}/`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Retrieves the purchase history of a specific item of an app.
   * @param {GetItemPurchaseHistoryParams} GetItemPurchaseHistoryParams - The parameters for the request.
   * @returns {Promise<History<PurchaseHistory>>} A Promise that resolves to an object containing the purchase history of the item.
   */
  getItemPurchaseHistory({
    appId,
    itemName,
    year,
    month,
    day,
  }: GetItemPurchaseHistoryParams): Promise<History<PurchaseHistory>> {
    const encodedItemName = encodeURIComponent(itemName);
    const query = { appId };
    let trailingUrl = `itemPurchaseHistory/${encodedItemName}/`;
    if (year) trailingUrl += `${year}/`;
    if (year && month) trailingUrl += `${month}/`;
    if (year && month && day) trailingUrl += `${day}/`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Retrieves the purchase history of a specific user of an app.
   * @param {GetUserPurchaseHistoryParams} GetUserPurchaseHistoryParams - The parameters for the request.
   * @returns {Promise<History<PurchaseHistory>>} - A Promise that resolves to an object containing the purchase history of the user.
   */
  getUserPurchaseHistory({
    appId,
    userId,
    year,
    month,
    day,
  }: GetUserPurchaseHistoryParams): Promise<History<PurchaseHistory>> {
    const query = { appId };
    let trailingUrl = `userPurchaseHistory/${userId}/`;
    if (year) trailingUrl += `${year}/`;
    if (year && month) trailingUrl += `${month}/`;
    if (year && month && day) trailingUrl += `${day}/`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Retrieves the usage history of all items of an app.
   * @param {GetItemHistoryParams} GetItemHistoryParams - The parameters for the request.
   * @returns {Promise<History<ItemHistory>>} - A Promise that resolves to an object containing the usage history.
   */
  getItemHistory({
    appId,
    year,
    month,
    day,
  }: GetItemHistoryParams): Promise<History<ItemHistory>> {
    const query = { appId };
    let trailingUrl = `itemHistory/`;
    if (year) trailingUrl += `${year}/`;
    if (year && month) trailingUrl += `${month}/`;
    if (year && month && day) trailingUrl += `${day}/`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Retrieves the usage history of a specific item of an app.
   * @param {GetSingleItemHistoryParams} GetSingleItemHistoryParams - The parameters for the request.
   * @returns {Promise<History<ItemHistory>>} - A Promise that resolves to an object containing the usage history of the item.
   */
  getSingleItemHistory({
    appId,
    itemName,
    year,
    month,
    day,
  }: GetSingleItemHistoryParams): Promise<History<ItemHistory>> {
    const encodedItemName = encodeURIComponent(itemName);
    const query = { appId };
    let trailingUrl = `singleItemHistory/${encodedItemName}/`;
    if (year) trailingUrl += `${year}/`;
    if (year && month) trailingUrl += `${month}/`;
    if (year && month && day) trailingUrl += `${day}/`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Retrieves the usage history of a specific user of an app.
   * @param {GetUserItemHistoryParams} GetUserItemHistoryParams - The parameters for the request.
   * @returns {Promise<History<ItemHistory>>} - A Promise that resolves to an object containing the item usage history of the user.
   */
  getUserItemHistory({
    appId,
    userId,
    year,
    month,
    day,
  }: GetUserItemHistoryParams): Promise<History<ItemHistory>> {
    const query = { appId };
    let trailingUrl = `userItemHistory/${userId}/`;
    if (year) trailingUrl += `${year}/`;
    if (year && month) trailingUrl += `${month}/`;
    if (year && month && day) trailingUrl += `${day}/`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Tries on store item to own NFT
   * @param {ItemTryOnParams} ItemTryOnParams - The parameters for trying on an item.
   * @returns {Promise<{ image: string; isOccupied: boolean }>} - A promise that returns an object containing the image and whether the item is occupied or not.
   */
  tryOnItem({
    appId,
    userId,
    storeId,
    itemName,
    chain,
    network,
    nftContractAddress,
    nftTokenId,
  }: ItemTryOnParams): Promise<{ image: string; isOccupied: boolean }> {
    const encodedItemName = encodeURIComponent(itemName);
    const body = {
      appId,
      userId,
      chain,
      network,
      nftContractAddress,
      nftTokenId,
    };
    const trailingUrl = `${storeId}/item/${encodedItemName}/try-on`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Uses an item
   * @template T - The itemType.
   * @param {ItemUseParams} ItemUseParams - The parameters for using an item.
   * @returns {UseItemReturnType[T]} - A Promise representing the retrieved item. The return type is determined based on the itemType.
   */
  useItem<T extends itemType>({
    appId,
    userId,
    itemName,
    quantity,
    params,
  }: ItemUseParams): UseItemReturnType[T] {
    const encodedItemName = encodeURIComponent(itemName);
    const body = {
      appId,
      quantity,
      ...(params && { params }),
    };
    const trailingUrl = `inventory/${userId}/item/${encodedItemName}/use`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Unequips an NFT trait item that is being worn on the NFT. When unworn, it will be restored to its original NFT attribute.
   * @param {string} appId - The ID of the app.
   * @param {string} userId - The ID of the user.
   * @param {string} itemName - The name of the item to unequip.
   * @param {string} chain - The symbol of chain with the NFT to unequip item.
   * @param {string} network - The name of network with the NFT to unequip item.
   * @param {string} contractAddress - The contract address of NFT to unequip item.
   * @param {string} tokenId - The ID of NFT to unequip item.
   * @returns {Promise<NftMetadata>} - A promise that returns the metadata of the NFT after unequip nft trait item.
   */
  unequipNftTraitItem(
    appId: string,
    userId: string,
    itemName: string,
    chain: string,
    network: string,
    contractAddress: string,
    tokenId: string
  ): Promise<NftMetadata> {
    const encodedItemName = encodeURIComponent(itemName);
    const body = {
      appId,
      chain,
      network,
      contractAddress,
      tokenId,
    };
    const trailingUrl = `inventory/${userId}/item/${encodedItemName}/unequip`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Unequips all NFT traits currently worn on the NFT.
   * @param {string} appId - The ID of the app.
   * @param {string} userId - The ID of the user.
   * @param {string} chain - The symbol of chain with the NFT to unequip item.
   * @param {string} network - The name of network with the NFT to unequip item.
   * @param {string} contractAddress - The contract address of NFT to unequip item.
   * @param {string} tokenId - The ID of NFT to unequip item.
   * @returns {Promise<NftMetadata>} - A promise that returns the metadata of the NFT after unequip nft trait item.
   */
  resetNftTraitItem(
    appId: string,
    userId: string,
    chain: string,
    network: string,
    contractAddress: string,
    tokenId: string
  ): Promise<NftMetadata> {
    const body = {
      appId,
      userId,
      chain,
      network,
      contractAddress,
      tokenId,
    };
    const trailingUrl = 'item/unequip/all';
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }
}
