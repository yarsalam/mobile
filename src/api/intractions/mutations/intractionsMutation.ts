import {useCallback} from 'react';
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

  // Keep the mutation methods, not the observer result objects, in callback
  // closures. TanStack Query may return a new result object on each render.
  const recordImpression = impressionMutation.mutateAsync;
  const recordClick = clickMutation.mutateAsync;
  const recordDismissal = dismissMutation.mutateAsync;

  const handlePromotionImpression = useCallback(
    (promotionId: string) => recordImpression(promotionId),
    [recordImpression],
  );
  const handlePromotionClick = useCallback(
    (promotionId: string) => recordClick(promotionId),
    [recordClick],
  );
  const handleDismissPromotion = useCallback(
    (promotionId: string) => recordDismissal(promotionId),
    [recordDismissal],
  );

  return {
    feed,
    isLoading,
    error,
    isRefreshing: isFetching,
    refreshFeed: refetch,
    handleLike: (userId: number) => likeMutation.mutate(userId),
    handleSuperLike: (userId: number) => superLikeMutation.mutate(userId),
    handlePass: (userId: number) => passMutation.mutate(userId),
    handlePromotionImpression,
    handlePromotionClick,
    handleDismissPromotion,
    isLiking: likeMutation.isPending,
    isSuperLiking: superLikeMutation.isPending,
  };
};
