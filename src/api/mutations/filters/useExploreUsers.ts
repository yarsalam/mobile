import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchExploreUsers } from '../../queries/fetchFilteredUsers';


export const useExploreUsers = (userId: number | undefined, options?: any) =>
  useInfiniteQuery({
    queryKey: ['exploreUsers', userId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchExploreUsers(pageParam, 10),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    enabled: !!userId,
    ...options,
  });