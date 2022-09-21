import AinftBase from './ainftBase';
import {
  AddEventActivityParams,
  CreateEventParams,
  RewardOptions,
  HttpMethod,
  GetEventActivityParams,
  UpdateEventActivityStatusParams,
  TokenomicsEvent,
  Activity,
  TaskType,
  RewardType,
  PendingRewards,
  History,
  RewardInfo,
} from './types';

const prefix = 'event';
export default class Event extends AinftBase {

  async create({
    appId,
    eventId,
    description,
    taskInstanceList,
    rewardInstanceList,
    startAt,
    endAt,
    platform,
  }: CreateEventParams) {
    const body = {
      appId,
      eventId,
      description,
      taskInstanceList,
      rewardInstanceList,
      startAt,
      endAt,
      platform,
    };
    const trailingUrl = '';
    await this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  async update({
    appId,
    eventId,
    description,
    startAt,
    endAt,
    taskInstanceList,
    rewardInstanceList,
  }: Partial<CreateEventParams>) {
    const body = {
      appId,
      description,
      startAt,
      endAt,
      taskInstanceList,
      rewardInstanceList,
    };
    const trailingUrl = `${eventId}`;
    await this.sendRequest(HttpMethod.PUT, prefix, trailingUrl, body);
  }

  async delete(appId: string, eventId: string) {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    await this.sendRequest(HttpMethod.DELETE, prefix, trailingUrl, query);
  }

  get(appId: string, eventId: string): Promise<TokenomicsEvent> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  addActivity({
    appId,
    userId,
    eventId,
    smartGalleryPosId,
    taskInstanceId,
    data: _data,
  }: AddEventActivityParams): Promise<string> {
    const body = {
      appId,
      userId,
      smartGalleryPosId,
      taskInstanceId,
      data: _data,
    };
    const trailingUrl = `${eventId}/activity`;
    return this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  getActivity({
    appId,
    userId,
    eventId,
    activityId,
    createdAt,
    options,
  }: GetEventActivityParams): Promise<Activity | null> {
    const query = {
      appId,
      userId,
      activityId,
      createdAt,
      ...options,
    };
    const trailingUrl = `${eventId}/activity`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  async updateActivityStatus({
    eventId,
    activityId,
    appId,
    createdAt,
    status,
  }: UpdateEventActivityStatusParams) {
    const body = {
      appId,
      status,
      createdAt,
    };
    const trailingUrl = `${eventId}/activity/${activityId}`;
    await this.sendRequest(HttpMethod.PUT, prefix, trailingUrl, body);
  }

  getTaskTypeList(appId: string): Promise<TaskType[]> {
    const query = { appId };
    const trailingUrl = 'task-types';
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  getRewardTypeList(appId: string): Promise<RewardType[]> {
    const query = { appId };
    const trailingUrl = 'reward-types';
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  getPendingRewards(appId: string, userId: string, eventId: string): Promise<PendingRewards> {
    const query = { appId, userId };
    const trailingUrl = `${eventId}/pending-rewards`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }

  reward(
    appId: string,
    userId: string,
    eventId: string,
    options?: RewardOptions
  ): Promise<{ amount: number }> {
    const body: any = {
      appId,
      userId,
      ...options && { options }
    };
    const trailingUrl = `${eventId}/reward`;
    return this.sendRequest(HttpMethod.POST, prefix, trailingUrl, body);
  }

  getRewardHistory(appId: string, userId: string, eventId: string): Promise<History<RewardInfo>> {
    const query = {
      appId,
      userId,
    };
    const trailingUrl = `${eventId}/reward-history`;
    return this.sendRequest(HttpMethod.GET, prefix, trailingUrl, query);
  }
}
