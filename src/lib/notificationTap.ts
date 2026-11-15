export const PENDING_NOTIFICATION_CLICK_ID_KEY =
  'pending_notification_click_id';
export const PENDING_NOTIFICATION_NAVIGATION_KEY =
  'pending_notification_navigation';

export type NotificationTapStorage = {
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
};

export type ConsumePendingNotificationTapOptions = {
  storage: NotificationTapStorage;
  isNavigationReady(): boolean;
  navigateToNotifications(): void;
  markClicked(notificationId: number): Promise<unknown>;
};

/**
 * Consume taps saved by Notifee's background handler when the app resumes.
 * Keep the navigation flag until React Navigation is ready; click attribution
 * is best-effort and is removed before the request so it cannot replay.
 */
export async function consumePendingNotificationTap({
  storage,
  isNavigationReady,
  navigateToNotifications,
  markClicked,
}: ConsumePendingNotificationTapOptions): Promise<void> {
  const pendingNavigation = await storage.getItem(
    PENDING_NOTIFICATION_NAVIGATION_KEY,
  );
  if (pendingNavigation === '1' && isNavigationReady()) {
    await storage.removeItem(PENDING_NOTIFICATION_NAVIGATION_KEY);
    navigateToNotifications();
  }

  const pendingClickId = await storage.getItem(
    PENDING_NOTIFICATION_CLICK_ID_KEY,
  );
  if (pendingClickId === null) return;

  await storage.removeItem(PENDING_NOTIFICATION_CLICK_ID_KEY);
  if (!/^\\d+$/.test(pendingClickId)) return;

  const notificationId = Number(pendingClickId);
  if (!Number.isSafeInteger(notificationId) || notificationId <= 0) return;

  try {
    await markClicked(notificationId);
  } catch {
    // Click attribution must never block opening the app or inbox.
  }
}
