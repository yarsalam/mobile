import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const getRecentSimilarUsers = (limit = 5) =>
  fetchWithAuth(`/users/recent-similar?limit=${limit}&daysAgo=30`);
