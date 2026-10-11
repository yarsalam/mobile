import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsRead } from '../../queries/messages'; // مسیر را بررسی کنید

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetUserId }: { targetUserId: number }) =>
      markAsRead(targetUserId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inboxGrouped'] });
      queryClient.invalidateQueries({ queryKey: ['sentGrouped'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    }
  });
};