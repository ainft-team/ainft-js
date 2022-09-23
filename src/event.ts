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
    return this.sendRequest(HttpMethod.POST, body);
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
    return this.sendRequest(HttpMethod.PUT, body, trailingUrl);
  }

  delete(appId: string, eventId: string): Promise<void> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.DELETE, query, trailingUrl);
  }

  get(appId: string, eventId: string): Promise<TokenomicsEvent> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
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
    return this.sendRequest(HttpMethod.POST, body, trailingUrl);
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
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
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
    return this.sendRequest(HttpMethod.PUT, body, trailingUrl);
  }

  getTaskTypeList(appId: string): Promise<TaskType[]> {
    const query = { appId };
    const trailingUrl = 'task-types';
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }

  getRewardTypeList(appId: string): Promise<RewardType[]> {
    const query = { appId };
    const trailingUrl = 'reward-types';
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }

  getPendingRewards(appId: string, userId: string, eventId: string): Promise<PendingRewards> {
    const query = { appId, userId };
    const trailingUrl = `${eventId}/pending-rewards`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
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
    return this.sendRequest(HttpMethod.POST, body, trailingUrl);
  }

  getRewardHistory(appId: string, userId: string, eventId: string): Promise<History<RewardInfo>> {
    const query = {
      appId,
      userId,
    };
    const trailingUrl = `${eventId}/reward-history`;
    return this.sendRequest(HttpMethod.GET, query, trailingUrl);
  }
}
