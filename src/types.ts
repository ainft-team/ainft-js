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
  DRESSUP_TWITTER_MINING = 'DRESSUP_TWITTER_MINING'
}

export enum NftActivityType {
  VISIT = 'VISIT',
  GAME = 'GAME',
  USE = 'USE',
  ACHIEVE = 'ACHIEVE',
  NFT_CUSTOMIZATION = 'NFT_CUSTOMIZATION'
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
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
};

export enum ItemGiveStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
};

export enum itemType {
  TICKET = 'TICKET',
  NFT_TRAIT = 'NFT_TRAIT',
  NFT = 'NFT',
};

export type UseItemReturnType = {
  [itemType.TICKET]: Promise<void>,
  [itemType.NFT_TRAIT]: Promise<NftMetadata>,
  [itemType.NFT]: Promise<string>,
};

// Text to Art
export enum ResponseStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum ModelID {
  STABLE_DIFFUSION_V1_4 = 'stable-diffusion-v1-4',
  STABLE_DIFFUSION_V1_5 = 'stable-diffusion-v1-5',
  STABLE_DIFFUSION_V2 = 'stable-diffusion-v2',
  STABLE_DIFFUSION_V2_1 = 'stable-diffusion-v2-1',
  STABLE_DIFFUSION_V2_768 = 'stable-diffusion-v2-768',
  STABLE_DIFFUSION_V2_1_768 = 'stable-diffusion-v2-1-768',
  OPENJOURNEY_V2 = 'openjourney-v2',
}
export enum SchedulerID {
  DDIM = 'ddim',
  PNDM = 'pndm',
  EULER_DISCRETE = 'euler_discrete',
  EULER_ANCESTRAL_DISCRETE = 'euler_ancestral_discrete',
  HEUN_DISCRETE = 'heun_discrete',
  K_DPM_2_DISCRETE = 'k_dpm_2_discrete',
  K_DPM_2_ANCESTRAL_DISCRETE = 'k_dpm_2_ancestral_discrete',
  LMS_DISCRETE = 'lms_discrete',
}

export interface AddNftSymbolParams {
  /** The ID of app. */
  appId: string;
  /** The symbol of chain. */
  chain: string;
  /** The name of network. */
  network: string;
  /** The address of contract. */
  contractAddress: string;
  /** Adds optional parameters.
   * Currently, it supports the 'isDynamic' option.
   * Setting the 'isDynamic' parameter to true allows hosting metadata through the AINFT factory. */
  options?: Record<string, any>;
}

export interface GetAppNftSymbolListParams {
  /** The ID of app. */
  appId: string;
}

export interface GetNftSymbolParams {
  /** The ID of app. */
  appId: string;
  /** The symbol of NFT. */
  symbol: string;
}

export interface RemoveNftSymbolParams {
  /** The ID of app. */
  appId: string;
  /** The symbol of NFT. */
  symbol: string;
}

export interface GetNftParams {
  /** The ID of app. */
  appId: string;
  /** The symbol of chain. */
  chain: string;
  /** The name of network. */
  network: string;
  /** The address of contract. */
  contractAddress: string;
  /** Token ID of NFT. */
  tokenId: string;
}

export interface GetNftContractInfoParams {
  /** The ID of app. */
  appId: string;
  /** The symbol of chain. */
  chain: string;
  /** The name of network. */
  network: string;
  /** The address of contract. */
  contractAddress: string;
}

export interface GetNftsInCollectionParams {
  chain: string;
  network: string;
  collectionId: string;
  appId?: string;
}

export interface GetNftsInEthContractParams extends Omit<GetNftsInCollectionParams, 'appId'> {
  chain: "ETH",
}

export interface GetNftsInAinCollectionParams extends GetNftsInCollectionParams {
  chain: "AIN",
  appId: string,
}

export interface GetUserNftListParams {
  /** The ID of app. */
  appId: string;
  /** The symbol of chain. */
  chain: string;
  /** The name of network. */
  network: string;
  /** The address of user. */
  userAddress: string;
  /** The address of contract. Use this if you want to find NFTs specific to a particular contract. */
  contractAddress?: string;
  /** Token ID of NFT. Use this if you want to find a specific NFT. You need to provide the contract address for it to work. */
  tokenId?: string;
}

export interface getTxBodySetNftMetadataParams {
  nftId: string;
  tokenId: string;
  metadata: NftMetadata;
  userAddress: string;
}

export interface SetNftMetadataParams extends SetEthNftMetadataParams, SetAinNftMetadataParams {}

export interface SetEthNftMetadataParams {
  /** The ID of app. */
  appId: string;
  /** The name of network. */
  network: string;
  /** The address of contract. */
  contractAddress: string;
  /** Token ID of NFT. */
  tokenId: string;
  /** The metadata to be set. */
  metadata: NftMetadata;
};

export interface SetAinNftMetadataParams extends Omit<getTxBodySetNftMetadataParams, 'userAddress'> {}

export interface Account {
  address: string;
  privateKey: string;
  publicKey?: string;
}

export interface DiscordMessageInfo {
  /** The ID of user. */
  user_id: string;
  /** The ID of discord guild. */
  guild_id: string;
  /** The ID of discord channel. */
  channel_id: string;
  /** The ID of discord message. */
  message_id: string;
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
  /** The ID of event. It should not overlap with the IDs of existing events in the app. */
  eventId: string;
  /** The ID of app. */
  appId: string;
  /** The ID of user. */
  userId: string;
  /** The description of event. */
  description: string;
  /** List of tasks to be performed in the event. */
  taskInstanceList: Array<TaskInstance>;
  /** List of rewards received upon completion of all tasks in the event. */
  rewardInstanceList: Array<RewardInstance>;
  /** The start time of the event. */
  startAt: number;
  /** The end time of the event. */
  endAt: number;
  /** The platform where the event takes place. */
  platform?: Platforms;
}

export interface TokenomicsEvent {
  /** The ID of app. */
  appId: string;
  /** The ID of event. */
  eventId: string;
  /** The start time of the event. */
  startAt: number;
  /** The end time of the event. */
  endAt: number;
  /** The description of event. */
  description: string;
  /** Map of tasks by task ID to be performed in the event. */
  taskInstances: { [taskInstanceId: string]: TaskInstance };
  /** Map of rewards by reward ID received upon completion of all tasks in the event. */
  rewardInstances: { [rewardInstanceId: string]: RewardInstance };
  /** The status of event. */
  status?: EventStatus;
  /** The platform where the event takes place. */
  platform?: Platforms;
  /** The timestamp when the event was created." */
  createdAt?: number;
  /** The timestamp when the event was updated." */
  updatedAt?: number;
};

export interface EventInfo extends TokenomicsEvent {
  id: string;
}

export interface TaskIdListByEventId {
  [eventId: string]: Array<string>;
}

export interface CreatePersonaModelInfo {
  /** The ID of model. */
  modelId: string,
}

export interface ChatResponse {
  /** The chat response with persona model. */
  response: {
    /** The ID of message. */
    messageId: string;
    /** The message answered by persona Model. */
    message: string;
  };
}

export interface ChannelPersonaModelInfo {
  /** The ID of persona model. */
  modelId: string;
  /** The name of persona model. */
  modelName: string;
}

export interface ServerPersonaModelInfo {
  /** The Discord Channel ID to which the persona model is linked.  */
  [channelId: string]: ChannelPersonaModelInfo;
}

export interface PersonaModelCreditInfo {
  /** The symbol of credit */
  symbol: string;
  /** The credit cost for chating with persona model. */
  burnAmount: number;
};

export interface TextToArtParams {
  prompt: string,
  negative_prompt: string,
  steps: number,
  seed: number,
  width: number,
  height: number,
  images: number,
  guidance_scale: number,
  model_id: ModelID,
  scheduler_type: SchedulerID,
}

export interface Task {
  /** The ID of task. */
  task_id: string;
  /** The timestamp when task was last updated. */
  updated_at: number;
}

export interface TextToArtResult {
  url: string,
  origin_url?: string,
  is_filtered: boolean,
}

export interface TextToArtResponse {
  /** The response of text-to-art request.  */
  status: ResponseStatus,
  /** The timestamp when Text to art request was last updated. */
  updated_at: number,
  /** The result of text-to-art. */
  result: { [imageIndex: string]: TextToArtResult },
}

export interface TextToArtTxHash {
  status: ResponseStatus,
  updated_at: number,
  result: { [status: string]: string },
}

export interface InviteInfo {
  /** The ID of inviter. */
  inviterId: string,
  /** A flag indicating whether the reward has been received or not. */
  isRewarded: boolean,
  /** Map by userId invited in a short time. */
  ambiguousInviters?: {
    [key: number]: string
  },
}

export interface AddActivityParams {
  /** The ID of app. */
  appId: string,
  /** The ID of user. */
  userId: string,
  /** The ID of event. */
  eventId?: string,
  /** The task ID being executed in this activity. */
  taskInstanceId?: string,
  /** The data of activity. */
  data: any,
};

export interface AddEventActivityParams extends AddActivityParams {
  /** The ID of event. */
  eventId: string,
};

export interface GetActivityParams {
  /** The ID of app. */
  appId: string,
  /** The timestamp when the activity was created.*/
  createdAt: number,
  /** The ID of user who performed the activity.  */
  userId?: string,
  /** The ID of the event that the activity belongs to. */
  eventId?: string,
  /** The ID of activity. */
  activityId?: string,
  options?: any,
};

export enum ActivityStatus {
  /** Status of activity valid after creation. */
  CREATED = 'CREATED',
  /** Status of activity already rewarded. */
  REWARDED = 'REWARDED',
  /** Status of invalid or excluded activity from reward. */
  FAILED = 'FAILED',
}

export interface Activity extends AddActivityParams {
  status: ActivityStatus,
  createdAt: number,
  updatedAt: number,
  id: string,
};

export interface GetEventActivityParams extends GetActivityParams {
  /** The ID of user. */
  userId: string,
  /** The ID of event. */
  eventId: string,
}

export interface UpdateEventActivityStatusParams {
  /** The ID of app. */
  appId: string,
  /** The timestamp of activity creation */
  createdAt: number,
  /** The ID of event. */
  eventId: string,
  /** The ID of activity */
  activityId: string,
  /** The status of activity. */
  status: ActivityStatus,
};

export interface User {
  id: string,
  address: string,
  ethAddresses?: {
    [ethAddress: string]: boolean,
  },
  };

export interface RewardOptions {
  /** If the reward has not been confirmed, you can enter the amount of reward. */
  amount?: number;
};

export interface StorePurchaseParams {
  /** The ID of the app. */
  appId: string;
  /** The ID of the store. */
  storeId: string;
  /** The ID of the user to buy store item. */
  userId: string;
  /** The name of the item to purchase. */
  itemName: string;
  /** The quantity of the item to purchase. */
  quantity: number;
};

export interface GetPurchaseHistoryParams {
  /** The ID of the app. */
  appId: string;
  /** The year to filter the history by. */
  year: number;
  /** The month to filter the history by. */
  month?: number;
  /** The day to filter the history by. */
  day?: number;
};

export interface GetItemPurchaseHistoryParams {
  /** The ID of the app. */
  appId: string;
  /** The name of the item. */
  itemName: string;
  /** The year to filter the history by. */
  year?: number;
  /** The month to filter the history by. */
  month?: number;
  /** The day to filter the history by. */
  day?: number;
};

export interface GetUserPurchaseHistoryParams {
  /** The ID of app. */
  appId: string;
  /** The ID of the user subject to the purchase history. */
  userId: string;
  /** The year to filter the history by. */
  year?: number;
  /** The month to filter the history by. */
  month?: number;
  /** The day to filter the history by. */
  day?: number;
};

export interface GetItemHistoryParams {
  /** The ID of app. */
  appId: string;
  /** The year to filter the history by. */
  year: number;
  /** The month to filter the history by. */
  month?: number;
  /** The day to filter the history by. */
  day?: number;
};

export interface GetSingleItemHistoryParams {
  /** The ID of app. */
  appId: string;
  /** The name of the item. */
  itemName: string;
  /** The year to filter the history by. */
  year?: number;
  /** The month to filter the history by. */
  month?: number;
  /** The day to filter the history by. */
  day?: number;
};

export interface GetUserItemHistoryParams {
  /** The ID of app. */
  appId: string;
  /** The ID of the user subject to the item history. */
  userId: string;
  /** The year to filter the history by. */
  year?: number;
  /** The month to filter the history by. */
  month?: number;
  /** The day to filter the history by. */
  day?: number;
};

export interface ItemTryOnParams {
  /** The ID of app. */
  appId: string,
  /** The ID of user to try on. */
  userId: string,
  /** The ID of the store with the item to try on. */
  storeId: string,
  /** The name of item to try on. */
  itemName: string,
  /** The symbol of chain with the NFT to try on the item. */
  chain: string,
  /** The name of network with the NFT to try on the item. */
  network: string,
  /** The contract address of NFT to try on the item. */
  nftContractAddress: string,
  /** The ID of NFT to try on the item. */
  nftTokenId: string,
};

export interface ItemUseParams {
  /** The ID of app. */
  appId: string,
  /** The ID of user to use item. */
  userId: string,
  /** The name of item to use. */
  itemName: string,
  /** The number of items user wants to use. */
  quantity: number,
  /** The parameters to send when using the item. It mainly contains NFT information. */
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
  storeOnSale?: { [storeId: string]: number };
  owners?: { [userId: string]: boolean };
};

export interface CreateItemParams {
  /** The ID of the app. */
  appId: string;
  name: string;
  /** The type of the item. The combination of type, subtype, and value is unique. */
  type: string;
  /** The subtype of the item. The combination of type, subtype, and value is unique. */
  subtype: string;
  /** The value of the item. The combination of type, subtype, and value is unique. */
  value: string;
  /** The description of the item. */
  description: string;
  /** The image of the item. */
  image?: string;
  /** The quantity of the item. */
  quantity: number;
  /** The additional information of the item. */
  additionalInfo?: { [key: string]: any };
}

export interface UpdateItemParams {
  /** The ID of the app. */
  appId: string;
  /** The name of the item. */
  itemName: string;
  /** New name of item to be set. */
  name?: string;
  /** Image of the item to be set. */
  image?: string;
  /** Description of the item to be set. */
  description?: string;
  /** Quantity of the item to increase or decrease. */
  quantity?: number;
  /** AdditionalInfo of the item to be set. */
  additionalInfo?: { [key: string]: any };
}

export interface RegisterItemParams {
  /** The ID of the app. */
  appId: string;
  /** The ID of the store for sale. */
  storeId: string;
  /** The name of the item. */
  itemName: string;
  /** The ID of user who sells an item. */
  seller: string;
  /** The quantity of to add to the store. */
  quantity: number;
  /** The price of the item in the store. */
  price: number;
  /** The currency used to purchase the item. */
  currency: string;
  /** The timestamp when the sale starts. */
  saleStartAt?: number;
  /** The timestamp when the sale ends. */
  saleEndAt?: number;
  /** The limit of item purchase per user. */
  maxPurchasePerUser?: number;
}

export interface UpdateStoreItemParams {
  /** The ID of the app. */
  appId: string;
  /** The ID of the store. */
  storeId: string;
  /** The name of the item. */
  itemName: string;
  /** The quantity of store item to be increase or decrease. */
  quantity?: number;
  /** The price of store item to be set. */
  price?: string;
  /** The timestamp when items start selling in the store. */
  saleStartAt?: number;
  /** The timestamp when items end selling in the store. */
  saleEndAt?: number;
  /** The status of the store item to be set. */
  status?: StoreItemStatus;
  /** The limit of item purchase per user. */
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
  name: string;
  currency: string;
  createdAt: number;
  status: PurchaseStatus;
};

export type ItemGiveHistory = {
  id: string;
  appId: string;
  type: string;
  subtype: string;
  value: string;
  quantity: number;
  reason?: string;
  createdAt: number;
  status: ItemGiveStatus;
};

export interface ItemHistory {
  id: string,
  appId: string,
  userId: string,
  type: string,
  name: string,
  subtype: string,
  value: string,
  quantity: number,
  quantityRemaining: number,
  createdAt: number,
  params?: any,
};

export type History<Type> = {
  [year: string]: {
    [month: string]: {
      [date: string]: {
        [id: string]: Type
      }
    }
  }
}

export type NftMetadata = {
  /** The name of NFT. */
  name?: string;
  /** The description of NFT. */
  description?: string;
  /** The image of NFT. */
  image?: string;
  /** The attributes of NFT. */
  attributes?: object[];
  /** The additional fields of NFT metadata. */
  [additionalFields: string]: any;
};

export type NftToken = {
  owner: string,
  tokenURI: string,
  metadata: NftMetadata,
  isBurnt: boolean,
  [key: string]: any;
};

export type NftTokens = {
  [nftTokenId: string]: NftToken,
};

export type NftContractInfo = {
  chain: string,
  network: string,
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
  network: string,
  name: string,
  symbol: string,
  contractAddress: string,
};

export type AppCreditInfo = {
  /** The name of credit. */
  name: string,
  /** The symbol of credit */
  symbol: string,
  /** The total supply of credit. */
  totalSupply: number,
  /** The amount of credit burned.  */
  burnedSupply: number,
  /** The max supply of credit. */
  maxSupply: number | null,
  /** The timestamp of credit creation. */
  createdAt: number,
};

export type ActivityNftInfo = {
  chain: string;
  network: string;
  contractAddress: string;
  tokenId: string;
  userAddress: string;
}

export enum AppCreditWithdrawStatus {
  REQUESTED = 'requested',
  COMPLETED = 'completed',
}

export interface WithdrawInfo {
  /** The status of withdraw request. */
  status: AppCreditWithdrawStatus;
  /** The amount of credits requested for withdrawal. */
  amount: number;
  /** The timestamp of the withdrawal request. */
  timestamp: number;
  /** The transaction hash that resulted from the completed withdrawal. */
  txHash?: string;
}

export interface UserWithdrawList {
  /** The symbol of chain */
  [chain: string]: {
    /** The address of user. */
    [userAddress: string]: {
      /** The ID of withdraw request. */
      [requestId: string]: WithdrawInfo;
    };
  };
}

export interface AppWithdrawList {
  [userId: string]: UserWithdrawList;
}

export interface WithdrawRequestMap {
  /** The Id of user. */
  [userId: string]: {
    /** The symbol of chain. */
    [chain: string]: {
      /** The address of user. */
      [userAddress: string]: {
        /** The ID of withdrawal request. */
        [requestId: string]: number;
      };
    };
  };
}

export interface DepositTransaction {
  /** The symbol of chain. */
  chain: string;
  /** The name of network. */
  network: string;
  /** The address of contract. */
  contractAddress: string;
  /** The address the token was sent from. */
  from: string;
  /** The address the token was send to. */
  to: string;
  /** The value of deposit transaction. */
  value: number;
  /** The transaction hash of deposit. */
  txHash: string;
  /** The block number at which the deposit transaction was applied. */
  blockNumber: number;
}

export interface LockupInfo {
  /** The timestamp when the lockup period ends.  */
  endAt: number;
  /** The amount of credit to lock. */
  amount: number;
  /** The reason for the lockup. */
  reason: string;
}

export interface LockupList {
  /** The ID of lockup. */
  [lockupId: string]: LockupInfo;
}

export interface DepositHistoryInfo {
  amount: number;
  fromAddress: string;
  status: string;
  registeredAt: number;
  symbol: string;
  chain: string;
  network: string;
};

export interface DepositHistory {
  [txHash: string]: DepositHistoryInfo;
};

export interface TokenUpdatePermission {
  collectionOwner: boolean;
  tokenOwner: boolean;
}

export interface getTxBodyMintNftParams {
  address: string;
  chain: string;
  network: string;
  appId: string;
  collectionId: string;
  metadata: object;
  toAddress: string;
  tokenId?: number;
}

export interface MintNftParams extends Omit<getTxBodyMintNftParams, 'address'> {}

export interface SearchOption {
  limit?: number,
  cursor?: string,
}
export interface NftSearchParams extends SearchOption {
  /** The address of the user who owns the AINFT. */
  userAddress?: string;
  /** The ID of AINFT object. */
  ainftObjectId?: string;
  /** The token ID of AINFT. */
  tokenId?: string;
  /** The name of AINFT object. */
  name?: string;
  /** The symbol of AINFT object. */
  symbol?: string;
}

export interface getTxBodyTransferNftParams {
  address?: string;
  chain: string;
  network: string;
  appId: string;
  collectionId: string;
  tokenId: number;
  toAddress: string;
}

export interface UploadAssetParams {
  /** The ID of app. */
  appId: string;
  /** The file path of asset to upload. */
  filePath: string;
}

export interface UploadAssetFromBufferParams extends UploadAssetParams {
  /** The buffer of asset to upload. */
  buffer: Buffer;
}

export interface UploadAssetFromDataUrlParams extends UploadAssetParams {
  /** The data url of asset to upload. */
  dataUrl: string;
}

export interface DeleteAssetParams {
  /** The ID of app. */
  appId: string;
  /** The file path of asset to delete. */
  filePath: string;
}

export interface TransferNftParams extends Omit<getTxBodyTransferNftParams, 'address'> {}

export interface getTxbodyAddAiHistoryParams {
  /** The symbol of chain. e.g. ETH */
  chain: string;
  /** The name of network. e.g. homestead  */
  network: string;
  /** The ID of app. */
  appId: string;
  /** The ID of AINFT object. */
  ainftObjectId: string;
  /** Token ID of NFT. */
  tokenId: string;
  /** Data about ai history. */
  data: object;
  /** The label of history. */
  label: string;
  /** The address of user. */
  userAddress: string;
}

export interface AddAiHistoryParams extends Omit<getTxbodyAddAiHistoryParams, 'userAddress'> {}

export interface AinftObjectSearchResponse extends SearchReponse {
  ainftObjects: {
    id: string;
    name: string;
    symbol: string;
    owner: string;
  }[];
}

export interface AinftTokenSearchResponse extends SearchReponse {
  nfts: {
    tokenId: string;
    owner: string;
    tokenURI: string;
    metadata?: object;
    ainftObject: AinftObjectSearchResponse;
  }[];
}

export interface SearchReponse {
  isFinal: boolean;
  cursor?: string;
}

export enum ServiceType {
  CHAT = 'chat',
}

/**
 * @deprecated Nickname of the service.
 */
export type ServiceNickname = string | 'openai';

/**
 * Name of the model to use. You can see the
 * [OpenAI model overview](https://platform.openai.com/docs/models/overview)
 * for description of them.
 * Please note that image-related models are currently not supported.
 */
export type Model =
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo';

/**
 * Represents a transaction result.
 */
export interface TransactionResult {
  tx_hash?: string | null;
  result?: Record<string, unknown> | null;
}

/**
 * Represents a chat configuration transaction result.
 */
export interface ChatConfigurationTransactionResult extends TransactionResult {
  config: ChatConfiguration;
}

/**
 * Represents a credit transaction result.
 */
export interface CreditTransactionResult extends Omit<TransactionResult, 'result'> {
  address: string;
  balance: number;
}

/**
 * Represents an assistant transaction result.
 */
export interface AssistantTransactionResult extends TransactionResult {
  assistant: Assistant;
}

/**
 * Represents an assistant deletion transaction result.
 */
export interface AssistantDeleteTransactionResult extends TransactionResult {
  delAssistant: AssistantDeleted;
}

/**
 * Represents a thread transaction result.
 */
export interface ThreadTransactionResult extends TransactionResult {
  thread: Thread;
}

/**
 * Represents a thread deletion transaction result.
 */
export interface ThreadDeleteTransactionResult extends TransactionResult {
  delThread: ThreadDeleted;
}

/**
 * Represents transaction result for a single message.
 */
export interface MessageTransactionResult extends TransactionResult {
  message: Message;
}

/**
 * Represents transaction result for a multiple messages.
 */
export interface MessagesTransactionResult extends TransactionResult {
  messages: MessageMap;
}

export interface ChatConfiguration {
  /** The type of the service. */
  type: ServiceType;
  /** The name of the service. */
  name: string;
}

export interface Assistant {
  /** The identifier. */
  id: string;
  /** The name of the model to use. */
  model: string;
  /** The name of the assistant. */
  name: string;
  /** The system instructions that the assistant uses. The maximum length is 32768 characters. */
  instructions: string;
  /** The description of the assistant. The maximum length is 512 characters. */
  description: string | null;
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata: object | null;
  /** The UNIX timestamp in seconds. */
  created_at: number;
}

export interface AssistantMinted {
  /** The ID of AINFT token. */
  tokenId: string;
  /** The ID of AINFT object. */
  objectId: string;
  /** The owner address of AINFT token. */
  owner: string;
  assistant: Assistant;
}

export interface AssistantDeleted {
  /** The identifier. */
  id: string;
  /** The delete flag. */
  deleted: boolean;
}

export interface AssistantCreateParams {
  /** The name of the model to use. */
  model: Model;
  /** The name of the assistant. The maximum length is 256 characters. */
  name: string;
  /** The system instructions that the assistant uses. The maximum length is 32768 characters. */
  instructions: string;
  /** The description of the assistant. The maximum length is 512 characters. */
  description?: string | null;
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata?: object | null;
}

export interface AssistantCreateOptions {
  /** If true, automatically set the name for the assistant. */
  autoName?: boolean;
  /** If true, automatically set the profile image for the assistant. */
  autoProfileImage?: boolean;
}

export interface AssistantUpdateParams {
  /** The name of the model to use. */
  model?: Model;
  /** The name of the assistant. The maximum length is 256 characters. */
  name?: string | null;
  /** The system instructions that the assistant uses. The maximum length is 32768 characters. */
  instructions?: string | null;
  /** The description of the assistant. The maximum length is 512 characters. */
  description?: string | null;
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata?: object | null;
}

export interface Thread {
  /** The identifier. */
  id: string;
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata: object | null;
  /** The UNIX timestamp in seconds. */
  created_at: number;
}

export interface ThreadWithAssistant {
  /** The identifier. */
  id: string;
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata: object | null;
  /** The UNIX timestamp in seconds. */
  created_at: number;
  assistant: Assistant;
}

export interface ThreadDeleted {
  /** The identifier. */
  id: string;
  /** The delete flag. */
  deleted: boolean;
}

export interface ThreadWithMessages {
  thread: Thread;
  messages: MessageMap;
}

export interface ThreadCreateParams {
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata?: object | null;
}

export interface ThreadCreateAndRunParams {
  metadata?: object | null;
  messages?: Array<MessageCreateParams>;
}

export interface ThreadUpdateParams {
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata?: object | null;
}

export interface Message {
  /** The identifier. */
  id: string;
  /** The ID of thread that message belongs to. */
  thread_id: string;
  /** The entity that produced the message. One of `user` or `assistant`. */
  role: 'user' | 'assistant';
  /** The message content includes text in an object. */
  content: { [key: string]: MessageContentText };
  /** If applicable, the ID of the assistant that authored this message. */
  assistant_id: string | null;
  /** If applicable, the ID of the run associated with the authoring of this message. */
  run_id: string | null;
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata: object | null;
  /** The UNIX timestamp in seconds. */
  created_at: number;
}

export interface MessageContentText {
  type: 'text';
  text: Text;
}

export interface Text {
  value: string;
}

export interface MessageMap {
  [key: string]: Message;
}

export interface QueryParams {
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  next?: string | null;
}

export interface Page<T> {
  data: T;
  first_id: string;
  last_id: string;
  has_more: boolean;
}

export interface MessageCreateParams {
  /** The role of the entity creating the message, currently only `user` is supported. */
  role: 'user';
  /** The content of the message. */
  content: string;
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata?: object | null;
}

export interface MessageUpdateParams {
  /**
   * The metadata can contain up to 16 pairs,
   * with keys limited to 64 characters and values to 512 characters.
   */
  metadata?: object | null;
}

export type EnvType = 'dev' | 'prod';
