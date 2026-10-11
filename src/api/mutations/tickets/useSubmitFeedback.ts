import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitFeedback } from '../../queries/tickets';

export const useSubmitFeedback = (ticketId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rating, comment }: { rating: number; comment?: string }) =>
      submitFeedback(ticketId, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};