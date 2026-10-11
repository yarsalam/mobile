import {useMutation, useQueryClient} from '@tanstack/react-query';import {deleteSingleMessage} from '../../queries/messages';

export const useDeleteSingleMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: number) => deleteSingleMessage(messageId),
    onSuccess: (data, messageId) => {
      queryClient.invalidateQueries({queryKey: ['chat']});
      queryClient.invalidateQueries({queryKey: ['inboxGrouped']});
      queryClient.invalidateQueries({queryKey: ['sentGrouped']});
    },
    onError: error => {
      console.error('Error deleting single message:', error);
    },
  });
};
