export interface SerializedMessage {
  code: number;
  message: string | undefined;
  data: any;
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
  DISCORD_INVITE = 'DISCORD_INVITE',
  DISCORD_INVITE_FIRST_CHAT = 'DISCORD_INVITE_FIRST_CHAT',
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
  PREVIEW = 'PREVIEW',
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
    name: string,
    description: string,
    contractAddress?: string,
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

export interface DailyRewardAmount {
  [timestamp: string]: RewardAmount;
}

export interface RewardAmount {
  minAmount: number;
  maxAmount: number;
}

export interface PendingRewards {
  totalAmount: RewardAmount;
  rewardAmounts: {
    [id: string]: RewardAmount | DailyRewardAmount;
  };
  validatedActivityList: Activity[];
}

export type RewardDetail = RewardAmount & {
  activities?: Array<Activity>;
};

export type DailyRewardDetail = {
  [timestamp: string]: RewardDetail;
};

export interface RewardInfo {
  id: string;
  appId: string;
  eventId: string;
  userId: string;
  rewardId: string;
  amount: number;
  createdAt: number;
  boostInfo?: any;
  details?: DailyRewardDetail | RewardDetail;
  rewardedDates?: DailyRewardDetail | RewardDetail; // rewardedDates property is changed to details. This property is removed soon...
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

export interface TokenomicsEvent {
  appId: string;
  eventId: string;
  startAt: number;
  endAt: number;
  description: string;
  taskInstances: { [taskInstanceId: string]: TaskInstance };
  rewardInstances: { [rewardInstanceId: string]: RewardInstance };
  status?: EventStatus;
  platform?: Platforms;
  createdAt?: number;
  updatedAt?: number;
};

export interface EventInfo extends TokenomicsEvent {
  id: string;
}

export interface TaskIdListByEventId {
  [eventId: string]: Array<string>;
}

export interface CreatePersonaModelInfo {
  modelId: string,
}

export interface ChatResponse {
  response: {
    messageId: string;
    message: string;
  };
}

export interface ChannelPersonaModelInfo {
  modelId: string;
  modelName: string;
}

export interface ServerPersonaModelInfo {
  [channelId: string]: ChannelPersonaModelInfo;
}

export interface InviteInfo {
  inviterId: string,
  isRewarded: boolean,
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

export interface GetActivityParams {
  appId: string,
  createdAt: number,
  userId?: string,
  eventId?: string,
  activityId?: string,
  options?: any,
};

export enum ActivityStatus {
  CREATED = 'CREATED',
  REWARDED = 'REWARDED',
  FAILED = 'FAILED',
}

export interface Activity extends AddActivityParams {
  status: ActivityStatus,
  createdAt: number,
  updatedAt: number,
  id: string,
};

export interface GetEventActivityParams extends GetActivityParams {
  userId: string,
  eventId: string,
}

export interface UpdateEventActivityStatusParams {
  appId: string,
  createdAt: number,
  eventId: string,
  activityId: string,
  status: string,
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

export interface GetPurchaseHistoryParams {
  appId: string;
  year: number;
  month?: number;
  day?: number;
};

export interface GetItemPurchaseHistoryParams {
  appId: string;
  itemName: string;
  year?: number;
  month?: number;
  day?: number;
};

export interface GetUserPurchaseHistoryParams {
  appId: string;
  userId: string;
  year?: number;
  month?: number;
  day?: number;
};

export interface GetItemHistoryParams {
  appId: string;
  year: number;
  month?: number;
  day?: number;
};

export interface GetSingleItemHistoryParams {
  appId: string;
  itemName: string;
  year?: number;
  month?: number;
  day?: number;
};

export interface GetUserItemHistoryParams {
  appId: string;
  userId: string;
  year?: number;
  month?: number;
  day?: number;
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

export interface ItemUseParams {
  appId: string,
  userId: string,
  itemName: string,
  quantity: number,
  params?: any,
}

export interface Item {
  appId: string;
  name: string;
  description: string;
  image?: string;
  type: string;
  subtype: string;
  value: string;
  quantityTotal: number;
  quantityRemaining: number;
  quantityOnSale: number;
  registrableQuantityOnStore: number;
  createdAt: number;
  updatedAt: number;
  storeOnSale: { [storeId: string]: number };
};

export interface CreateItemParams {
  appId: string;
  name: string;
  type: string;
  subtype: string;
  value: string;
  description: string;
  image?: string;
  quantity: number;
}

export interface UpdateItemParams {
  appId: string;
  itemName: string;
  name?: string;
  image?: string;
  description?: string;
  quantity?: number;
}

export interface RegisterItemParams {
  appId: string;
  storeId: string;
  itemName: string;
  seller: string;
  quantity: number;
  price: number;
  currency: string;
  saleStartAt?: number;
  saleEndAt?: number;
  maxPurchasePerUser?: number;
}

export interface UpdateStoreItemParams {
  appId: string;
  storeId: string;
  itemName: string;
  quantity?: string;
  price?: string;
  saleStartAt?: number;
  saleEndAt?: number;
  status?: StoreItemStatus;
  maxPurchasePerUser?: number;
}

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

export interface ItemHistory {
  id: string,
  appId: string,
  userId: string,
  type: string,
  subtype: string,
  value: string,
  quantity: number,
  quantityRemaining: number,
  createdAt: number,
  params?: any,
};

export type History <Type> = {
  [year: string]: {
    [month: string]: {
      [date: string]: {
        [id: string]: Type
      }
    }
  }
}

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

export type NftContractInfo = {
  chain: string,
  name: string,
  symbol: string,
  contractAddress: string,
  deployAddress: string,
  totalSupply: number,
  lastBlockNumber: number,
};

export type NftContract = {
  info: NftContractInfo,
  tokens: NftTokens,
};

export type NftCollections = {
  [nftContractAddress: string]: NftContract,
};

export type NftContractBySymbol = {
  chain: string,
  name: string,
  symbol: string,
  contractAddress: string,
};

export type AppCreditInfo = {
  name: string,
  symbol: string,
  totalSupply: number,
  burnedSupply: number,
  maxSupply: number | null,
  createdAt: number,
};