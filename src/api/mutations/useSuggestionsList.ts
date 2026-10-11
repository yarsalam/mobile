import {useQuery} from '@tanstack/react-query';
import {getSuggestions} from '../queries/suggestions';

export const useSuggestionsList = (userId: number | undefined, limit = 10) => {
  return useQuery({
    queryKey: ['suggestions', userId, limit],
    queryFn: () => getSuggestions(userId!, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
