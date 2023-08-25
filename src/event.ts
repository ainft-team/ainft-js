import FactoryBase from './factoryBase';
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

export default class Event extends FactoryBase {
  /**
   * Create a new event. Set the tasks to be performed and the rewards to receive.
   * @param {CreateEventParams} CreateEventParams
   */
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

  /**
   * Update an existing event.
   * @param {Partial<CreateEventParams>} UpdateEventParams
   */
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

  /**
   * Delete an existing event.
   * @param {string} appId
   * @param {string} eventId
   */
  delete(appId: string, eventId: string): Promise<void> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Get event.
   * @param {string} appId
   * @param {string} eventId
   */
  get(appId: string, eventId: string): Promise<TokenomicsEvent> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  // NOTE(liayoo): calling this function will create a user if the userId doesn't exist.
  /**
   * Add an activity that matches the event.
   * @param {AddEventActivityParams} AddEventActivityParams
   * @returns return activity ID.
   */
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

  /**
   * @param {GetEventActivityParams} GetEventActivityParams
   * @returns {Promise<Activity | null>} Return activity object or null.
   */
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

  /**
   * Update the activity's status. Activity status includes CREATED, REWARDED, and FAILED.
   * @param {UpdateEventActivityStatusParams} UpdateEventActivityStatusParams
   */
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

  /**
   * Returns a list of TaskTypes to use for events.
   * @param {string} appId
   */
  getTaskTypeList(appId: string): Promise<TaskType[]> {
    const query = { appId };
    const trailingUrl = 'task-types';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Returns a list of RewardTypes to use for events.
   * @param {string} appId
   */
  getRewardTypeList(appId: string): Promise<RewardType[]> {
    const query = { appId };
    const trailingUrl = 'reward-types';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Return user's pending reward from event.
   * @param {string} appId
   * @param {string} userId
   * @param {string} eventId
   */
  getPendingRewards(
    appId: string,
    userId: string,
    eventId: string
  ): Promise<PendingRewards> {
    const query = { appId, userId };
    const trailingUrl = `${eventId}/pending-rewards`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Provide event rewards to users.
   * @param {string} appId
   * @param {string} userId
   * @param {string} eventId
   * @param {RewardOptions} options If the reward has not been confirmed, you can enter the amount of reward.
   */
  reward(
    appId: string,
    userId: string,
    eventId: string,
    options?: RewardOptions
  ): Promise<{ amount: number }> {
    const body: any = {
      appId,
      userId,
      ...(options && { options }),
    };
    const trailingUrl = `${eventId}/reward`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Returns list of user's reward history.
   * @param {string} appId
   * @param {string} userId
   * @param {string} eventId
   */
  getRewardHistory(
    appId: string,
    userId: string,
    eventId: string
  ): Promise<RewardInfo[]> {
    const query = {
      appId,
      userId,
    };
    const trailingUrl = `${eventId}/reward-history`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Returns list of user's activity.
   * @param {string} appId
   * @param {string} userId
   * @param {string} eventId
   */
  getActivityHistory(
    appId: string,
    userId: string,
    eventId: string
  ): Promise<Activity[]> {
    const query = {
      appId,
      userId,
    };
    const trailingUrl = `${eventId}/activity-history`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }
}
