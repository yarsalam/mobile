import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchFilteredUsers} from '../../queries/fetchFilteredUsers';

export const useFilterUsers = (filters: Record<string, any>, options?: any) =>
  useInfiniteQuery({
    queryKey: ['filteredUsers', filters],
    queryFn: ({pageParam = 0}) =>
      fetchFilteredUsers({...filters, page: pageParam, limit: 10}),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    ...options,
  });
