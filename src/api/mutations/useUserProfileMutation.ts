import { useQuery } from '@tanstack/react-query';
import { fetchFullUserProfile } from '../queries/users';

export const useUserProfile = (userId: number | undefined) => {

  const query = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchFullUserProfile(userId!),
    enabled: !!userId,
  });

  return query;
};