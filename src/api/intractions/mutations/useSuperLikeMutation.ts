import {useMutation, useQueryClient} from '@tanstack/react-query';
import {checkLikeStatus, superLikeUser} from '../queries/intractionsApi';
import {useToast} from '../../../context/ToastContext';

export const useSuperLikeMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (targetUserId: number) => {
      const { hasSuperLiked } = await checkLikeStatus(targetUserId);
      if (hasSuperLiked) throw new Error('قبلاً سوپرلایک کرده‌اید');
      return superLikeUser(targetUserId);
    },
    onSuccess: (_, targetUserId) => {
      showToast('سوپرلایک شد', 'success');
      queryClient.invalidateQueries({ queryKey: ['interactions', targetUserId] });
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      showToast(err.message || 'خطا در سوپرلایک', 'error');
    },
  });
};