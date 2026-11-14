import {describe, expect, it, jest} from '@jest/globals';
import {
  NOTIFICATION_QUERY_KEYS,
  refreshNotificationQueries,
} from './notificationSync';

describe('notification reconnect synchronization', () => {
  it('invalidates every server-backed notification projection', async () => {
    const queryClient = {
      invalidateQueries: jest.fn().mockResolvedValue(undefined),
    };

    await refreshNotificationQueries(queryClient as any);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(
      NOTIFICATION_QUERY_KEYS.length,
    );
    for (const queryKey of NOTIFICATION_QUERY_KEYS) {
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({queryKey});
    }
  });
});
