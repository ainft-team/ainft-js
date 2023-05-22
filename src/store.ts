import AinftBase from './ainftBase';
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

export default class Store extends AinftBase {
  /**
   * Creates a new item.
   * @param {CreateItemParams} CreateItemParams - The parameters to create a new item.
   * @param {string} CreateItemParams.appId - The ID of the app.
   * @param {string} CreateItemParams.type - The type of the item. The combination of type, subtype, and value is unique.
   * @param {string} CreateItemParams.subtype - The subtype of the item. The combination of type, subtype, and value is unique.
   * @param {string} CreateItemParams.value - The value of the item. The combination of type, subtype, and value is unique.
   * @param {string} CreateItemParams.name - The name ofthe item. Name also is unique.
   * @param {string=} CreateItemParams.description - The description of the item.
   * @param {string=} CreateItemParams.image - The image of the item.
   * @param {string} CreateItemParams.quantity - The quantity of the item.
   * @param {object=} CreateItemParams.additionalInfo - The additional information of the item. You can add your own content for each item.
   * @returns {Promise<Item>} Created item.
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
   * @param {string} UpdateItemParams.appId - The ID of the app.
   * @param {string} UpdateItemParams.itemName - Current name of the item.
   * @param {string=} UpdateItemParams.name - Name of the item to be changed.
   * @param {string=} UpdateItemParams.image - Image of the item to be changed.
   * @param {string=} UpdateItemParams.description - Description of the item to be changed.
   * @param {string} UpdateItemParams.quantity - Quantity of the item to increase or decrease.
   * @param {string=} UpdateItemParams.additionalInfo - AdditionalInfo of the item to be changed.
   * @returns {Promise} void.
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
   * @returns {Promise} void.
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
   * @param {string} RegisterItemParams.appId - The ID of the app.
   * @param {string} RegisterItemParams.storeId - The ID of the store for sale.
   * @param {string} RegisterItemParams.itemName - The name of the item for sale.
   * @param {string} RegisterItemParams.seller - The ID of the seller.
   * @param {number} RegisterItemParams.quantity - The quantity of to add to the store.
   * @param {number} RegisterItemParams.price - The price of the item in the store.
   * @param {string} RegisterItemParams.currency - The currency used to purchase the item.
   * @param {number=} RegisterItemParams.saleStartAt - Sale start date.
   * @param {number=} RegisterItemParams.saleEndAt - Sale end date.
   * @param {number=} RegisterItemParams.maxPurchasePerUser - Item purchase limit per user.
   * @returns {Promise<StoreItem>} The store item is registered.
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
   * @returns {Promise} void.
   */
  deregisterItem(appId: string, storeId: string, itemName: string) {
    const query = { appId };
    const trailingUrl = `${storeId}/item/${encodeURIComponent(itemName)}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Returns a list of all items created in the app. If type/subtype is given, returns only items of the given type/subtype.
   * @param {string} appId
   * @param {string} userId The ID of the user who will receive the item.
   * @param {string} itemName The name of the item to give.
   * @param {string} quantity The quantity of the item to give.
   * @param {string=} reason The reason for giving an item. ex) Event for NFT holder
   * @returns {Promise<ItemGiveHistory>}
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
   * Update item in store.
   * @param {UpdateStoreItemParams} UpdateStoreItemParams - The parameters to update store item.
   * @param {string} UpdateStoreItemParams.appId - The ID of the app.
   * @param {string} UpdateStoreItemParams.storeId - The ID of the store.
   * @param {string} UpdateStoreItemParams.itemName - The name of the item.
   * @param {number=} UpdateStoreItemParams.price - The price of store item to be changed.
   * @param {number=} UpdateStoreItemParams.quantity - The quantity of store item to be increase or decrease.
   * @param {StoreItemStatus=} UpdateStoreItemParams.status - The status of the store item to be changed.
   * @param {number=} UpdateStoreItemParams.saleStartAt - The sale start date time of the store item to be changed.
   * @param {number=} UpdateStoreItemParams.saleEndAt - The sale end date time of the store item to be changed.
   * @param {number=} UpdateStoreItemParams.maxPurchasePerUser - The purchase limit per user of the store item to be changed.
   * @returns {Promise<void>}
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
   * @param {string} StorePurchaseParams.appId - The ID of the app.
   * @param {string} StorePurchaseParams.storeId - The ID of the store.
   * @param {string} StorePurchaseParams.userId - The ID of the user.
   * @param {string} StorePurchaseParams.itemName - The name of the item to purchase.
   * @param {number} StorePurchaseParams.quantity - The quantity of the item to purchase.
   * @returns {Promise<PurchaseHistory>} The purchase history.
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
   * @param {string} GetPurchaseHistoryParams.appId - The ID of the app.
   * @param {number} GetPurchaseHistoryParams.year - The year to filter the history by.
   * @param {number=} GetPurchaseHistoryParams.month - The month to filter the history by.
   * @param {number=} GetPurchaseHistoryParams.day - The day to filter the history by.
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
   * @param {string} GetItemPurchaseHistoryParams.appId - The ID of the app.
   * @param {string} GetItemPurchaseHistoryParams.itemName - The name of the item.
   * @param {number} GetItemPurchaseHistoryParams.year - The year to filter the history by.
   * @param {number=} GetItemPurchaseHistoryParams.month - The month to filter the history by.
   * @param {number=} GetItemPurchaseHistoryParams.day - The day to filter the history by.
   * @returns {Promise<History<PurchaseHistory>>} - A Promise that resolves to an object containing the purchase history of the item.
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
   * @param {string} GetUserPurchaseHistoryParams.appId - The ID of the app.
   * @param {string} GetUserPurchaseHistoryParams.userId - The ID of the user.
   * @param {number} GetUserPurchaseHistoryParams.year - The year to filter the history by.
   * @param {number=} GetUserPurchaseHistoryParams.month - The month to filter the history by.
   * @param {number=} GetUserPurchaseHistoryParams.day - The day to filter the history by.
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
   * @param {string} GetItemHistoryParams.appId - The ID of the app.
   * @param {number} GetItemHistoryParams.year - The year to filter the history by.
   * @param {number=} GetItemHistoryParams.month - The month to filter the history by.
   * @param {number=} GetItemHistoryParams.day - The day to filter the history by.
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
   * @param {string} GetSingleItemHistoryParams.appId - The ID of the app.
   * @param {string} GetSingleItemHistoryParams.itemName - The name of the item.
   * @param {number} GetSingleItemHistoryParams.year - The year to filter the history by.
   * @param {number=} GetSingleItemHistoryParams.month - The month to filter the history by.
   * @param {number=} GetSingleItemHistoryParams.day - The day to filter the history by.
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
   * @param {string} GetUserItemHistoryParams.appId - The ID of the app.
   * @param {string} GetUserItemHistoryParams.userId - The ID of the user.
   * @param {number} GetUserItemHistoryParams.year - The year to filter the history by.
   * @param {number=} GetUserItemHistoryParams.month - The month to filter the history by.
   * @param {number=} GetUserItemHistoryParams.day - The day to filter the history by.
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
   * @param {ItemTryOnParams} ItemTryOnParams - Parameters for trying on an item.
   * @param {string} ItemTryOnParams.appId - The ID of the application.
   * @param {string} ItemTryOnParams.userId - The ID of the user.
   * @param {string} ItemTryOnParams.storeId - The ID of the store.
   * @param {string} ItemTryOnParams.itemName - The name of the item.
   * @param {string} ItemTryOnParams.chain - The chain of the nft.
   * @param {string} ItemTryOnParams.nftContractAddress - The address of the NFT contract.
   * @param {string} ItemTryOnParams.nftTokenId - The ID of the NFT token.
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
   * @param {ItemUseParams} ItemUseParams - Parameters for using an item.
   * @param {string} ItemUseParams.appId - The ID of the app.
   * @param {string} ItemUseParams.userId - The ID of the user.
   * @param {string} ItemUseParams.itemName - The name of the item.
   * @param {number} ItemUseParams.quantity - The quantity of item to use.
   * @param {object=} ItemUseParams.params - The parameters to send when using the item. It mainly contains NFT information.
   * @returns {Promise<NftMetadata | null>} - A promise that returns the metadata of the used NFT or null if the item is not an NFT trait.
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
   * @param {string} chain - The chain ID of the nft contract. Currently, we only support ETH.
   * @param {string} network - The network name of the nft contract. e.g) homestead, goerli.
   * @param {string} contractAddress - The nft contract address.
   * @param {string} tokenId - The id of the your nft token.
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
   * @param {string} chain - The chain ID of the nft contract. Currently, we only support ETH.
   * @param {string} network - The network name of the nft contract. e.g) homestead, goerli.
   * @param {string} contractAddress - The nft contract address.
   * @param {string} tokenId - The id of the your nft token.
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
