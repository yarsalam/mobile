import {useQuery} from '@tanstack/react-query';
import {
  getFeed,
  trackPromotionImpression,
  trackPromotionClick,
  dismissPromotion,
} from '../queries/intractionsApi';
import {useLikeMutation} from './useLikeMutation';
import {useSuperLikeMutation} from './useSuperLikeMutation';
import {usePassMutation} from './usePassMutation';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useFeed = (limit: number = 20) => {
  const queryClient = useQueryClient();

  const {
    data: feed = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['feed', limit],
    queryFn: () => getFeed(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const removeFromFeed = (userId: number) =>
    queryClient.setQueryData(['feed', limit], (old: any[] = []) =>
      old.filter(item => !(item.type === 'user' && item.data?.id === userId)),
    );

  const likeMutation = useLikeMutation();
  const superLikeMutation = useSuperLikeMutation();
  const passMutation = usePassMutation(userId => removeFromFeed(userId));

  const impressionMutation = useMutation({
    mutationFn: trackPromotionImpression,
    retry: 2,
  });
  const clickMutation = useMutation({
    mutationFn: trackPromotionClick,
    retry: 1,
  });
  const dismissMutation = useMutation({
    mutationFn: dismissPromotion,
    onSuccess: (_, promotionId) => {
      queryClient.setQueryData(['feed', limit], (old: any[] = []) =>
        old.filter(item => item.id !== promotionId),
      );
    },
  });

  return {
    feed,
    isLoading,
    error,
    isRefreshing: isFetching,
    refreshFeed: refetch,
    handleLike: (userId: number) => likeMutation.mutate(userId),
    handleSuperLike: (userId: number) => superLikeMutation.mutate(userId),
    handlePass: (userId: number) => passMutation.mutate(userId),
    handlePromotionImpression: (promotionId: string) =>
      impressionMutation.mutateAsync(promotionId),
    handlePromotionClick: (promotionId: string) =>
      clickMutation.mutateAsync(promotionId),
    handleDismissPromotion: (promotionId: string) =>
      dismissMutation.mutateAsync(promotionId),
    isLiking: likeMutation.isPending,
    isSuperLiking: superLikeMutation.isPending,
  };
};
