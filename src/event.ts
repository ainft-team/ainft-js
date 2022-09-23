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

export default class Event extends AinftBase {

  create({
    appId,
    eventId,
    description,
    taskInstanceList,
    rewardInstanceList,
    startAt,
    endAt,
    platform,
  }: CreateEventParams): Promise<void> {
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
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  update({
    appId,
    eventId,
    description,
    startAt,
    endAt,
    taskInstanceList,
    rewardInstanceList,
  }: Partial<CreateEventParams>): Promise<void> {
    const body = {
      appId,
      description,
      startAt,
      endAt,
      taskInstanceList,
      rewardInstanceList,
    };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.PUT, trailingUrl, body);
  }

  delete(appId: string, eventId: string): Promise<void> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  get(appId: string, eventId: string): Promise<TokenomicsEvent> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
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
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
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
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  updateActivityStatus({
    eventId,
    activityId,
    appId,
    createdAt,
    status,
  }: UpdateEventActivityStatusParams): Promise<void> {
    const body = {
      appId,
      status,
      createdAt,
    };
    const trailingUrl = `${eventId}/activity/${activityId}`;
    return this.sendRequest(HttpMethod.PUT, trailingUrl, body);
  }

  getTaskTypeList(appId: string): Promise<TaskType[]> {
    const query = { appId };
    const trailingUrl = 'task-types';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getRewardTypeList(appId: string): Promise<RewardType[]> {
    const query = { appId };
    const trailingUrl = 'reward-types';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  getPendingRewards(appId: string, userId: string, eventId: string): Promise<PendingRewards> {
    const query = { appId, userId };
    const trailingUrl = `${eventId}/pending-rewards`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
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
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  getRewardHistory(appId: string, userId: string, eventId: string): Promise<History<RewardInfo>> {
    const query = {
      appId,
      userId,
    };
    const trailingUrl = `${eventId}/reward-history`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
