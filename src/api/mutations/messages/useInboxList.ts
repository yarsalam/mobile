import {useQuery} from '@tanstack/react-query';
import {fetchGroupedInbox} from '../../queries/messages';

export const useInboxList = (userId: number) => { // اضافه شدن {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inboxGrouped', userId],
    queryFn: () => fetchGroupedInbox(), // userId را پاس ندهید
    enabled: !!userId,
  });
  return { data, isLoading, refetch }; // باید مقادیر را return کند
}; // اضافه شدن }