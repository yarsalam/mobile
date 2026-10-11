import {fetchWithAuth} from '../../lib/fetchWithAuth';

// Backend identifies the current user from the JWT; userId must not be supplied by the client.
export const getSuggestions = (_userId?: number, limit = 10) =>
  fetchWithAuth(`/suggestions?limit=${limit}`);
