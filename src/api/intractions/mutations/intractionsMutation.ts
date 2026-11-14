import {useQuery} from '@tanstack/react-query';
import {
  getFeed,
  dismissPromotion,
  trackPromotionClick,
  trackPromotionImpression,
} from '../queries/intractionsApi';
import {useLikeMutation} from './useLikeMutation';
import {useSuperLikeMutation} from './useSuperLikeMutation';
import {usePassMutation} from './usePassMutation';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useRef} from 'react';
import {createPromotionImpressionTracker} from '../../../lib/promotionImpression';

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

  const dismissMutation = useMutation({
    mutationFn: dismissPromotion,
    onSuccess: (_, promotionId) => {
      queryClient.setQueryData(['feed', limit], (old: any[] = []) =>
        old.filter(item => item.id !== promotionId),
      );
    },
  });

  const promotionClickMutation = useMutation({
    mutationFn: trackPromotionClick,
  });

  const promotionImpressionMutation = useMutation({
    mutationFn: trackPromotionImpression,
  });

  const promotionImpressionTrackerRef = useRef<
    ReturnType<typeof createPromotionImpressionTracker> | null
  >(null);
  if (!promotionImpressionTrackerRef.current) {
    promotionImpressionTrackerRef.current = createPromotionImpressionTracker(
      promotionId => promotionImpressionMutation.mutateAsync(promotionId),
    );
  }

  return {
    feed,
    isLoading,
    error,
    isRefreshing: isFetching,
    refreshFeed: refetch,
    handleLike: (userId: number) => likeMutation.mutate(userId),
    handleSuperLike: (userId: number) => superLikeMutation.mutate(userId),
    handlePass: (userId: number) => passMutation.mutate(userId),
    handleDismissPromotion: (promotionId: string) =>
      dismissMutation.mutate(promotionId),
    handlePromotionClick: (promotionId: string) =>
      promotionClickMutation.mutateAsync(promotionId),
    handlePromotionImpression: promotionImpressionTrackerRef.current,
    isLiking: likeMutation.isPending,
    isSuperLiking: superLikeMutation.isPending,
  };
};
