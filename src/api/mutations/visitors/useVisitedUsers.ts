import {useQuery} from '@tanstack/react-query';
import {getVisitedProfiles} from '../../auth/queries/visitors';

export const useVisitedUsers = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['visitedUsers', userId],
    queryFn: () => getVisitedProfiles(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // ۲ دقیقه
    gcTime: 5 * 60 * 1000,
  });
};
