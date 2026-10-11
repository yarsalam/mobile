import { useQuery } from '@tanstack/react-query';
import { fetchFullUserProfile } from '../queries/users';


export const useFullUserProfile = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['fullUserProfile', userId],
    queryFn: () => fetchFullUserProfile(userId!),
    enabled: !!userId,
  });
};