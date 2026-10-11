import { useQuery } from '@tanstack/react-query';
import { fetchUserTickets } from '../../queries/tickets';

export const useTicketsList = (userId: number | undefined) =>
  useQuery({
    queryKey: ['tickets', userId],
    queryFn: () => fetchUserTickets(userId!),
    enabled: !!userId,
  });