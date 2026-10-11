import {fetchWithAuth} from '../../lib/fetchWithAuth';

const BASE = '/ai-assistant';

export const fetchConversations = () => fetchWithAuth(`${BASE}/conversations`);
export const fetchConversation = (convId: number) =>
  fetchWithAuth(`${BASE}/conversations/${convId}`);
export const startConversation = (initialMessage?: string) =>
  fetchWithAuth(`${BASE}/conversations`, {
    method: 'POST',
    body: JSON.stringify({initialMessage}),
  });
export const sendMessage = (convId: number, message: string) =>
  fetchWithAuth(`${BASE}/conversations/${convId}/messages`, {
    method: 'POST',
    body: JSON.stringify({message}),
  });

export const fetchAdvice = () => fetchWithAuth(`${BASE}/advice`);
export const fetchGuidance = () => fetchWithAuth(`${BASE}/guidance`);
export const fetchOptimizationPlan = () => fetchWithAuth(`${BASE}/optimization-plan`);
export const fetchProblems = () => fetchWithAuth(`${BASE}/problems`);

export const fetchIcebreakers = (targetUserId: number) =>
  fetchWithAuth(`${BASE}/icebreakers`, {
    method: 'POST',
    body: JSON.stringify({targetUserId}),
  });
export const fetchSuggestReply = (convId: number, message: string) =>
  fetchWithAuth(`${BASE}/suggest-reply`, {
    method: 'POST',
    body: JSON.stringify({convId, message}),
  });
