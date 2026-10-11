import {useQuery} from '@tanstack/react-query';
import {fetchUserTickets} from '../../queries/tickets';

export const useTicketsList = () =>
  useQuery({
    queryKey: ['tickets'],
    queryFn: fetchUserTickets,
  });
