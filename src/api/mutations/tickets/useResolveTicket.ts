import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveTicket } from '../../queries/tickets';

export const useResolveTicket = (ticketId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resolution: string) => resolveTicket(ticketId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};