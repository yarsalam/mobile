// useLikeMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkLikeStatus, likeUser } from '../queries/intractionsApi';
import { useToast } from '../../../context/ToastContext';

export const useLikeMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (targetUserId: number) => {
      const { hasLiked } = await checkLikeStatus(targetUserId);
      if (hasLiked) throw new Error('قبلاً لایک کرده‌اید');
      return likeUser(targetUserId);
    },
    onSuccess: (_, targetUserId) => {
      showToast('لایک شد', 'success');
      queryClient.invalidateQueries({ queryKey: ['interactions', targetUserId] });
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      showToast(err.message || 'خطا در لایک', 'error');
    },
  });
};