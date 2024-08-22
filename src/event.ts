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
import { authenticated } from './utils/decorator';

/**
 * This class supports event functionality for activating tokenomics in the community.\
 * Do not create it directly; Get it from AinftJs instance.
 */
export default class Event extends FactoryBase {
  /**
   * Creates a new event. Sets the tasks to be performed and the rewards to receive.
   * @param {CreateEventParams} CreateEventParams The parameters to create event.
   */
  @authenticated
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
   * Updates an event.
   * @param {Partial<CreateEventParams>} UpdateEventParams The parameters to update event.
   */
  @authenticated
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
   * Deletes an event.
   * @param {string} appId The ID of app.
   * @param {string} eventId The ID of event.
   */
  @authenticated
  delete(appId: string, eventId: string): Promise<void> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.DELETE, trailingUrl, query);
  }

  /**
   * Gets event.
   * @param {string} appId The ID of app.
   * @param {string} eventId The ID of event.
   * @returns Returns event information.
   */
  @authenticated
  get(appId: string, eventId: string): Promise<TokenomicsEvent> {
    const query = { appId };
    const trailingUrl = `${eventId}`;
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  // NOTE(liayoo): calling this function will create a user if the userId doesn't exist.
  /**
   * Adds an activity that matches the event.
   * @param {AddEventActivityParams} AddEventActivityParams The parameters to add event activity.
   * @returns Returns activity ID.
   */
  @authenticated
  addActivity({
    appId,
    userId,
    eventId,
    taskInstanceId,
    data: _data,
  }: AddEventActivityParams): Promise<string> {
    const body = {
      appId,
      userId,
      taskInstanceId,
      data: _data,
    };
    const trailingUrl = `${eventId}/activity`;
    return this.sendRequest(HttpMethod.POST, trailingUrl, body);
  }

  /**
   * Gets activity information.
   * @param {GetEventActivityParams} GetEventActivityParams The parameters to get event activity.
   * @returns {Promise<Activity | null>} Returns activity object or null.
   */
  @authenticated
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
   * Updates the activity's status. Activity status includes CREATED, REWARDED, and FAILED.
   * @param {UpdateEventActivityStatusParams} UpdateEventActivityStatusParams The parameters to update activity status
   */
  @authenticated
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
   * @param {string} appId The ID of app.
   */
  @authenticated
  getTaskTypeList(appId: string): Promise<TaskType[]> {
    const query = { appId };
    const trailingUrl = 'task-types';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Returns a list of RewardTypes to use for events.
   * @param {string} appId The ID of app.
   */
  @authenticated
  getRewardTypeList(appId: string): Promise<RewardType[]> {
    const query = { appId };
    const trailingUrl = 'reward-types';
    return this.sendRequest(HttpMethod.GET, trailingUrl, query);
  }

  /**
   * Return user's pending reward from event.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of the user who wants to check pending rewards.
   * @param {string} eventId The ID of event to check pending rewards.
   */
  @authenticated
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
   * Provides event rewards to users.
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of user to be rewarded.
   * @param {string} eventId The ID of the event that the user participated in.
   * @param {RewardOptions} options The options of reward.
   */
  @authenticated
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
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of the user who wants to check reward history.
   * @param {string} eventId The ID of event to check reward history.
   */
  @authenticated
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
   * @param {string} appId The ID of app.
   * @param {string} userId The ID of the user who wants to check the activity history.
   * @param {string} eventId The ID of the event you want to check activity history.
   */
  @authenticated
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
