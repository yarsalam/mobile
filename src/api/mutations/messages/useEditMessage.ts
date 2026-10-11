import {useMutation, useQueryClient} from '@tanstack/react-query';
import {editMessage} from '../../queries/messages'; // مسیر را بررسی کنید

export const useEditMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editMessage,
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
      queryClient.invalidateQueries({ queryKey: ['inboxGrouped'] });
      queryClient.invalidateQueries({ queryKey: ['sentGrouped'] });
    },
  });
};