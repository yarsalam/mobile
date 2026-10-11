import {fetchWithAuth} from '../../lib/fetchWithAuth';

// User-scoped route: backend derives the user ID from the JWT.
export const fetchUserTickets = () => fetchWithAuth('/tickets/me');

export const fetchTicketDetail = (ticketId: number) =>
  fetchWithAuth(`/tickets/${ticketId}`);

export const createTicket = (data: {
  title: string;
  description: string;
  category?: string;
  metadata?: Record<string, unknown>;
}) =>
  fetchWithAuth('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const addMessageToTicket = (ticketId: number, content: string) =>
  fetchWithAuth(`/tickets/${ticketId}/messages`, {
    method: 'POST',
    body: JSON.stringify({content}),
  });

// The current backend exposes feedback, but not a user-facing resolve endpoint.
export const submitFeedback = (
  ticketId: number,
  rating: number,
  comment?: string,
) =>
  fetchWithAuth(`/tickets/${ticketId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({rating, comment}),
  });
