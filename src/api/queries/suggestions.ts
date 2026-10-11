// api/queries/suggestions.ts
import { fetchWithAuth } from '../../lib/fetchWithAuth';

export const getSuggestions = async (userId: number, limit = 10) => {
  return fetchWithAuth(
    `http://192.168.0.133:5001/suggestions?userId=${userId}&limit=${limit}`
  );
};