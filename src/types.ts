export interface SerializedMessage {
  code: number;
  message: string | undefined;
  data: string | boolean | object | null | undefined;
}

export enum RewardTypeCategory {
  APP_CREDIT = 'APP_CREDIT',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  WHITELIST = 'WHITELIST',
  AIRDROP = 'AIRDROP',
}

export enum RewardDistributeType {
  ON_ACTIVITY = 'ON_ACTIVITY',
  MANUAL = 'MANUAL',
}

export enum TaskTypeCategory {
  TWITTER_MINING = 'TWITTER_MINING',
  NFT_GAME = 'NFT_GAME',
}

export enum Platforms {
  DISCORD = 'DISCORD'
}

export enum EventStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  END = 'END',
  DEPRECATED = 'DEPRECATED',
}

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HttpMethodToAxiosMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
}

export enum StoreItemStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
};

export enum PurchaseStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED"
};

export interface Account {
  address: string;
  privateKey: string;
  publicKey?: string;
}

export interface InstanceParams {
  [key: string]: any;
}

export interface TaskType {
  id: string;
  category: TaskTypeCategory;
  description: string;
  isEnabled: boolean;
  params: InstanceParams;
}

export interface TaskInstance {
  id?: string;
  taskTypeId: string;
  category: TaskTypeCategory;
  params: InstanceParams;
}

export interface RewardType {
  id: string;
  category: RewardTypeCategory;
  description: string;
  params: {
    name: true;
    description: true;
    contractAddress?: true;
  } & InstanceParams;
}

export interface RewardInstance {
  id?: string;
  rewardTypeId: string;
  category: RewardTypeCategory;
  amount: number;
  distributeAt: RewardDistributeType;
  params: {
    name: string;
    description: string;
    contractAddress?: string;
  } & InstanceParams;
}

export interface CreateEventParams {
  eventId: string;
  appId: string;
  userId: string;
  description: string;
  taskInstanceList: Array<TaskInstance>;
  rewardInstanceList: Array<RewardInstance>;
  startAt: number;
  endAt: number;
  platform?: Platforms;
}

export interface EventInfo {
  id: string,
  appId: string,
  startAt: number,
  endAt: number,
  description: string,
  taskInstances: { [key: string]: TaskInstance },
  rewardInstances: { [key: string]: RewardInstance },
  status?: EventStatus,
  platform?: string,
  createdAt?: number,
  updatedAt?: number,
}

export interface TaskIdListByEventId {
  [eventId: string]: Array<string>;
}

export interface AddActivityParams {
  appId: string,
  userId: string,
  eventId?: string,
  smartGalleryPosId?: string,
  taskInstanceId?: string,
  data: any,
};

export interface AddEventActivityParams extends AddActivityParams {
  eventId: string,
};

export interface User {
  id: string,
  address: string,
  ethAddresses?: {
    [ethAddress: string]: boolean,
  },
};

export interface RewardOptions {
  amount?: number;
};

export interface StorePurchaseParams {
  appId: string;
  storeId: string;
  userId: string;
  itemName: string;
  quantity: number;
};

export interface ItemTryOnParams {
  appId: string,
  userId: string,
  storeId: string,
  itemName: string,
  chain: string,
  nftContractAddress: string,
  nftTokenId: string,
};

export interface Item  {
  name: string;
  description: string;
  image?: string;
  type: string;
  subtype: string;
  value: string;
  quantityTotal: number;
  quantityRemaining: number;
  quantityOnSale: number;
  createdAt: number;
  updatedAt: number;
};

export interface StoreItem extends Omit<Item, 'quantityOnSale'> {
  price: number;
  seller: string;
  currency: string;
  status: StoreItemStatus;
  saleStartAt?: number;
  saleEndAt?: number;
  maxPurchasePerUser?: number;
};

export interface UserItem extends Omit<Item, 'quantityTotal' | 'quantityOnSale'> {
  quantityBought: number;
};

export interface PurchaseHistory {
  id: string;
  appId: string;
  storeId: string;
  type: string;
  subtype: string;
  value: string;
  seller: string;
  buyer: string;
  quantity: number;
  payment: number;
  currency: string;
  createdAt: number;
  status: PurchaseStatus;
};

export type NftMetadata = {
  name: string,
  description: string,
  image: string,
  attributes: object[],
};

export type NftToken = {
  owner: string,
  tokenURI: string,
  metadata: NftMetadata,
  isBurnt: boolean,
};

export type NftTokens = {
  [nftTokenId: string]: NftToken,
};

export type NftCollections = {
  [nftCollectionsAddress: string]: NftTokens,
};

export type NftContract = {
  chain: string,
  name: string,
  symbol: string,
  contractAddress: string,
};

export type UserNfts = {
  chain: string,
  address: string,
  collections: NftCollections,
};

export type AppCreditInfo = {
  name: string,
  symbol: string,
  totalSupply: number,
  burnedSupply: number,
  maxSupply: number | null,
  createdAt: number,
};
