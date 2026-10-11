import { useQuery } from '@tanstack/react-query';
import { fetchTicketDetail } from '../../queries/tickets';

export const useTicketDetail = (ticketId: number) =>
  useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => fetchTicketDetail(ticketId),
    enabled: !!ticketId,
  });