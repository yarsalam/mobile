import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchExploreUsers } from '../../queries/fetchFilteredUsers';


export const useExploreUsers = (userId: number, options?: any) =>
  useInfiniteQuery({
    queryKey: ['exploreUsers', userId],
    queryFn: ({ pageParam = 0 }) => fetchExploreUsers(pageParam, 10),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    enabled: !!userId,
    ...options,
  });