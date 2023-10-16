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
  appId: string;
  chain: string;
  network: string;
  contractAddress: string;
  options?: Record<string, any>;
}

export interface GetAppNftSymbolListParams {
  appId: string;
}

export interface GetNftSymbolParams {
  appId: string;
  symbol: string;
}

export interface RemoveNftSymbolParams {
  appId: string;
  symbol: string;
}

export interface GetNftParams {
  appId: string;
  chain: string;
  network: string;
  contractAddress: string;
  tokenId: string;
}

export interface GetNftContractInfoParams {
  appId: string;
  chain: string;
  network: string;
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
  appId: string;
  chain: string;
  network: string;
  userAddress: string;
  contractAddress?: string;
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
  appId: string;
  chain: "ETH";
  network: string;
  contractAddress: string;
  tokenId: string;
  metadata: NftMetadata;
};

export interface SetAinNftMetadataParams extends Omit<getTxBodySetNftMetadataParams, 'userAddress'> {}

export interface Account {
  address: string;
  privateKey: string;
  publicKey?: string;
}

export interface DiscordMessageInfo {
  user_id: string;
  guild_id: string;
  channel_id: string;
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

export interface PersonaModelCreditInfo {
  symbol: string;
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
  task_id: string;
  updated_at: number;
}

export interface TextToArtResult {
  url: string,
  origin_url?: string,
  is_filtered: boolean,
}

export interface TextToArtResponse {
  status: ResponseStatus,
  updated_at: number,
  result: { [imageIndex: string]: TextToArtResult },
}

export interface TextToArtTxHash {
  status: ResponseStatus,
  updated_at: number,
  result: { [status: string]: string },
}

export interface InviteInfo {
  inviterId: string,
  isRewarded: boolean,
  ambiguousInviters?: {
    [key: number]: string
  },
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
  network: string,
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
  storeOnSale?: { [storeId: string]: number };
  owners?: { [userId: string]: boolean };
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
  additionalInfo?: { [key: string]: any };
}

export interface UpdateItemParams {
  appId: string;
  itemName: string;
  name?: string;
  image?: string;
  description?: string;
  quantity?: number;
  additionalInfo?: { [key: string]: any };
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
  quantity?: number;
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
  name?: string;
  description?: string;
  image?: string;
  attributes?: object[];
  [additionalFields: string]: any;
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
  name: string,
  symbol: string,
  totalSupply: number,
  burnedSupply: number,
  maxSupply: number | null,
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
  status: AppCreditWithdrawStatus;
  amount: number;
  timestamp: number;
  txHash?: string;
}

export interface UserWithdrawList {
  [chain: string]: {
    [userAddress: string]: {
      [requestId: string]: WithdrawInfo;
    };
  };
}

export interface AppWithdrawList {
  [userId: string]: UserWithdrawList;
}

export interface WithdrawRequestList {
  [userId: string]: {
    [chain: string]: {
      [userAddress: string]: {
        [requestId: string]: number;
      };
    };
  };
}

export interface DepositTransaction {
  chain: string;
  network: string;
  contractAddress: string;
  from: string;
  to: string;
  value: number;
  txHash: string;
  blockNumber: number;
}

export interface LockupInfo {
  endAt: number;
  amount: number;
  reason: string;
}

export interface LockupList {
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

export interface NftSearchParams {
  userAddress?: string;
  ainftObjectId?: string;
  tokenId?: string;
  name?: string;
  symbol?: string;
}

export interface SearchOption {
  limit?: number,
  offset?: string,
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
  appId: string;
  filePath: string;
}

export interface UploadAssetFromBufferParams extends UploadAssetParams {
  buffer: Buffer;
}

export interface UploadAssetFromDataUrlParams extends UploadAssetParams {
  dataUrl: string;
}

export interface DeleteAssetParams {
  appId: string;
  filePath: string;
}

export interface TransferNftParams extends Omit<getTxBodyTransferNftParams, 'address'> {}

export interface getTxbodyAddAiHistoryParams {
  chain: string;
  network: string;
  appId: string;
  collectionId: string;
  tokenId: string;
  data: object;
  label: string;
  address: string;
}

export interface AddAiHistoryParams extends Omit<getTxbodyAddAiHistoryParams, 'address'> {};

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