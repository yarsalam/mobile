import {fetchWithAuth} from '../../lib/fetchWithAuth';

const BASE = '/moderation';

export const checkMessage = (text: string, receiverId: number) =>
  fetchWithAuth(`${BASE}/check`, {
    method: 'POST',
    body: JSON.stringify({text, receiverId}),
  });

export const checkMessageAsync = (text: string, receiverId: number, messageId?: number) =>
  fetchWithAuth(`${BASE}/check-async`, {
    method: 'POST',
    body: JSON.stringify({text, receiverId, messageId}),
  });

export const getUserRiskProfile = (userId: number) =>
  fetchWithAuth(`${BASE}/user/${userId}/risk`);
export const getDailyStats = (days = 7) =>
  fetchWithAuth(`${BASE}/stats/daily?days=${days}`);
export const getHighRiskUsers = (limit = 20, minSeverity = 'high') =>
  fetchWithAuth(`${BASE}/high-risk-users?limit=${limit}&minSeverity=${minSeverity}`);
export const unblockUser = (userId: number) =>
  fetchWithAuth(`${BASE}/user/${userId}/unblock`, {method: 'POST'});
export const moderationHealthCheck = () => fetchWithAuth(`${BASE}/health`);
