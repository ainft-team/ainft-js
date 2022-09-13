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
