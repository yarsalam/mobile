import {useInfiniteQuery, InfiniteData} from '@tanstack/react-query';
import {fetchMessages} from '../../queries/messages';

export const useChatMessages = (userId: number, targetId: number) =>
  useInfiniteQuery<any, Error, InfiniteData<any>, any, any>({
    queryKey: ['chat', userId, targetId],
    queryFn: ({pageParam = 0}) => fetchMessages(targetId, pageParam),
    initialPageParam: 0, // !!! این خط اضافه شد !!!
    getNextPageParam: (lastPage: any, allPages) => {
      if (lastPage.length < 20) return undefined;
      return allPages.length;
    },
    enabled: !!userId && !!targetId,
    staleTime: 5 * 60 * 1000,
  });