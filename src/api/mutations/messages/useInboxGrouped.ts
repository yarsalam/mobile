import {useQuery} from '@tanstack/react-query';
import {fetchGroupedInbox} from '../../queries/messages'; // مسیر را بررسی کنید

export const useInboxGrouped = (userId: number) => // userId برای queryKey
  useQuery({
    queryKey: ['inboxGrouped', userId],
    queryFn: () => fetchGroupedInbox(), // userId را به fetchGroupedInbox پاس ندهید
    enabled: !!userId,
  });