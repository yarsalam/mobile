import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteConversation } from '../../queries/messages'; // مسیر را بررسی کنید

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetUserId }: { targetUserId: number }) =>
      deleteConversation(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inboxGrouped'] });
      queryClient.invalidateQueries({ queryKey: ['sentGrouped'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
  });
};