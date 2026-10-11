import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useToast} from '../../../context/ToastContext';
import {blockUser} from '../queries/intractionsApi';

export const useBlockMutation = () => {
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  return useMutation({
    mutationFn: ({userId, targetId}: {userId: number; targetId: number}) =>
      blockUser(userId, targetId),
    onSuccess: async (_, variables) => {
      showToast('کاربر بلاک شد', 'success');
      const rel = queryClient.setQueryData(
        ['relation', variables.targetId],
        (old: any) => ({
          ...old,
          blockedByMe: true,
        }),
      );
      console.log('rel', rel);
      console.log('variables', variables);
      const feed = await queryClient.invalidateQueries(['feed']);
      const suggestions = await queryClient.invalidateQueries(['suggestions']);
      const relation = await queryClient.invalidateQueries(['relation', variables.targetId]); // به‌روزرسانی رابطه

      console.log('feed', feed);
      console.log('suggestions', suggestions);
      console.log('relation', relation);
    },
    onError: (err: any) =>
      showToast(err.response?.data?.message || 'خطا', 'error'),
  });
};
