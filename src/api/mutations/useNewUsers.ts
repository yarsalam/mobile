import {useQuery} from '@tanstack/react-query';
import {getRecentSimilarUsers} from '../queries/newUsers';

export const useNewUsers = (limit = 5) => {
  return useQuery({
    queryKey: ['recentSimilarUsers', limit],
    queryFn: () => getRecentSimilarUsers(limit),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
