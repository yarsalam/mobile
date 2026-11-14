import type {QueryClient, QueryKey} from '@tanstack/react-query';

export const NOTIFICATION_QUERY_KEYS: QueryKey[] = [
  ['unread-notifications'],
  ['notifications'],
  ['interaction-count'],
  ['system-count'],
  ['interactions'],
  ['system-notifications'],
  ['badges'],
];

/**
 * The server inbox is authoritative. Invalidate all notification projections
 * after a socket reconnect or a realtime event so offline records are fetched.
 */
export async function refreshNotificationQueries(
  queryClient: Pick<QueryClient, 'invalidateQueries'>,
): Promise<void> {
  await Promise.all(
    NOTIFICATION_QUERY_KEYS.map(queryKey =>
      queryClient.invalidateQueries({queryKey}),
    ),
  );
}
