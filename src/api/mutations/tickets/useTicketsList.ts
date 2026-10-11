import {useQuery} from '@tanstack/react-query';
import {fetchUserTickets} from '../../queries/tickets';

// Keep the optional parameter for existing callers; the backend uses JWT identity.
export const useTicketsList = (_userId?: number) =>
  useQuery({
    queryKey: ['tickets'],
    queryFn: fetchUserTickets,
  });
