export enum RewardType {
  APP_CREDIT = 'APP_CREDIT',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  WHITELIST = 'WHITELIST',
  AIRDROP = 'AIRDROP',
}

export enum RewardDistributeType {
  ON_ACTIVITY = 'ON_ACTIVITY',
  MANUAL = 'MANUAL',
  CRON = 'CRON',
}

export interface Account {
  address: string;
  privateKey: string;
  publicKey?: string;
}

export interface InstanceParams {
  [key: string]: any;
}
export interface TaskInstance {
  id?: string;
  taskTypeId: string;
  params: InstanceParams;
}

export interface RewardInstance {
  id?: string;
  rewardTypeId: string;
  type: RewardType;
  amount: number;
  distributeAt: RewardDistributeType;
  distributeCronTime?: any;
  params: {
    name: string;
    description: string;
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
}

export interface CreateEventParams extends TokenomicsEvent {
  userId: string;
}
