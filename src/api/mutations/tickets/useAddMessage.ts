import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMessageToTicket } from '../../queries/tickets';

export const useAddMessage = (ticketId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addMessageToTicket(ticketId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};