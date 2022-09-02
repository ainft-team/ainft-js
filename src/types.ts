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
  // CRON = 'CRON',
}

export enum TaskTypeCategory {
  TWITTER_MINING = 'TWITTER_MINING',
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
  // distributeCronTime?: any;
  params: {
    name: string;
    description: string;
    contractAddress?: string;
  } & InstanceParams;
}

export interface TokenomicsEvent {
  eventId: string;
  appId: string;
  description: string;
  taskInstanceList: Array<TaskInstance>;
  rewardInstanceList: Array<RewardInstance>;
  startAt: number;
  endAt: number;
  status?: EventStatus;
  platform?: Platforms;
  rewardHistory?: {
    [rewardHistoryId: string]: boolean;
  };
  activityHistory?: {
    [activityId: string]: boolean;
  };
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateEventParams extends TokenomicsEvent {
  userId: string;
}

export interface MappedEvents {
  [eventId: string]: Array<string>;
}
