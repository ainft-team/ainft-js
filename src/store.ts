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
    additionalInfo,
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
      additionalInfo,
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
    additionalInfo,
  }: UpdateItemParams) {
    const body = { appId, name, image, description, quantity, additionalInfo };
    const trailingUrl = `item/${encodeURIComponent(itemName)}`;
    return this.sendRequest(HttpMethod.PUT, trailingUrl, body);
  }

  deregisterItemFromAllStore(
    appId: string,
    type: string,
    subtype: string,
    value: string
  ) {
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

  giveItemToUser(appId: string, userId: string, itemName: string, quantity: number, reason?: string) {
    const body = {
      appId,
      name: itemName,
      quantity,
      reason,
    }
    const trailingUrl = `inventory/${userId}/item`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
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

  /**
   * Returns a list of all items created in the app. If type/subtype is given, returns only items of the given type/subtype.
   * @param {string} appId
   * @param {string=} type The type of the items to fetch.
   * @param {string=} subtype The subtype of the items to fetch.
   * @returns {Item[]} List of items
   */
  getAllItems(appId: string, type?: string, subtype?: string): Promise<Item[]> {
    const query = { appId, type, subtype };
    const trailingUrl = `items`;
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

  tryOnItem({
    appId,
    userId,
    storeId,
    itemName,
    chain,
    nftContractAddress,
    nftTokenId,
  }: ItemTryOnParams): Promise<{ image: string, isOccupied: boolean }> {
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
  }: ItemUseParams): Promise<NftMetadata | null> {
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
   * @param appId
   * @param userId
   * @param itemName The name of the item to unequip.
   * @param chain ChainId. Currently, we only support ETH.
   * @param network Network name. e.g) homestead, goerli.
   * @param contractAddress NFT contract address.
   * @param tokenId Your NFT token Id.
   * @returns
   */
  unequipNftTraitItem(
    appId: string,
    userId: string,
    itemName: string,
    chain: string,
    network: string,
    contractAddress: string,
    tokenId: string,
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
   * @param appId
   * @param userId
   * @param chain ChainId. Currently, we only support ETH.
   * @param network Network name. e.g) homestead, goerli.
   * @param contractAddress NFT contract address.
   * @param tokenId Your NFT token Id.
   * @returns
   */
  resetNftTraitItem(
    appId: string,
    userId: string,
    chain: string,
    network: string,
    contractAddress: string,
    tokenId: string,
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
