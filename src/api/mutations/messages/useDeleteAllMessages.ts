import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAllMessages } from '../../queries/messages'; // مسیر را بررسی کنید

export const useDeleteAllMessages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllMessages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inboxGrouped'] });
      queryClient.invalidateQueries({ queryKey: ['sentGrouped'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
  });
};