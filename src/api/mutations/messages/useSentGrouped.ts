import {useQuery} from '@tanstack/react-query';
import {fetchGroupedSent} from '../../queries/messages';

export const useSendGrouped = (userId: number) => // userId برای queryKey
  useQuery({
    queryKey: ['sentGrouped', userId],
    queryFn: () => fetchGroupedSent(), // userId را پاس ندهید
    enabled: !!userId,
  });