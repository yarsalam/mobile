import {describe, expect, it, jest} from '@jest/globals';
import {
  consumePendingNotificationTap,
  PENDING_NOTIFICATION_CLICK_ID_KEY,
  PENDING_NOTIFICATION_NAVIGATION_KEY,
} from './notificationTap';

function createStorage(initial: Record<string, string>) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    storage: {
      getItem: jest.fn(async (key: string) => values.get(key) ?? null),
      removeItem: jest.fn(async (key: string) => {
        values.delete(key);
      }),
    },
  };
}

describe('consumePendingNotificationTap', () => {
  it('routes and records a tap when the app resumes from the background', async () => {
    const {values, storage} = createStorage({
      [PENDING_NOTIFICATION_CLICK_ID_KEY]: '42',
      [PENDING_NOTIFICATION_NAVIGATION_KEY]: '1',
    });
    const navigateToNotifications = jest.fn();
    const markClicked = jest.fn(async () => undefined);

    await consumePendingNotificationTap({
      storage,
      isNavigationReady: () => true,
      navigateToNotifications,
      markClicked,
    });

    expect(navigateToNotifications).toHaveBeenCalledTimes(1);
    expect(markClicked).toHaveBeenCalledWith(42);
    expect(values.size).toBe(0);
  });

  it('keeps the navigation request until React Navigation is ready', async () => {
    const {values, storage} = createStorage({
      [PENDING_NOTIFICATION_CLICK_ID_KEY]: '7',
      [PENDING_NOTIFICATION_NAVIGATION_KEY]: '1',
    });
    const navigateToNotifications = jest.fn();
    const markClicked = jest.fn(async () => undefined);

    await consumePendingNotificationTap({
      storage,
      isNavigationReady: () => false,
      navigateToNotifications,
      markClicked,
    });

    expect(navigateToNotifications).not.toHaveBeenCalled();
    expect(markClicked).toHaveBeenCalledWith(7);
    expect(values.get(PENDING_NOTIFICATION_NAVIGATION_KEY)).toBe('1');
    expect(values.has(PENDING_NOTIFICATION_CLICK_ID_KEY)).toBe(false);
  });

  it('discards malformed click IDs without sending a request', async () => {
    const {values, storage} = createStorage({
      [PENDING_NOTIFICATION_CLICK_ID_KEY]: '42x',
    });
    const markClicked = jest.fn(async () => undefined);

    await consumePendingNotificationTap({
      storage,
      isNavigationReady: () => true,
      navigateToNotifications: jest.fn(),
      markClicked,
    });

    expect(markClicked).not.toHaveBeenCalled();
    expect(values.has(PENDING_NOTIFICATION_CLICK_ID_KEY)).toBe(false);
  });

  it('does not let a failed click-attribution request block navigation', async () => {
    const {storage} = createStorage({
      [PENDING_NOTIFICATION_CLICK_ID_KEY]: '11',
      [PENDING_NOTIFICATION_NAVIGATION_KEY]: '1',
    });
    const navigateToNotifications = jest.fn();

    await expect(
      consumePendingNotificationTap({
        storage,
        isNavigationReady: () => true,
        navigateToNotifications,
        markClicked: async () => {
          throw new Error('network unavailable');
        },
      }),
    ).resolves.toBeUndefined();

    expect(navigateToNotifications).toHaveBeenCalledTimes(1);
  });
});
