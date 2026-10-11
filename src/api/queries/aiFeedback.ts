import {fetchWithAuth} from '../../lib/fetchWithAuth';

const BASE = '/feedback';

export const submitFeedback = (data: {
  userId: number;
  feature: string;
  phase?: number;
  feedbackType?: string;
  impactScore?: number;
  source?: string;
  value?: Record<string, any>;
  context?: Record<string, any>;
}) =>
  fetchWithAuth(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const fetchAllFeedback = (limit = 100) =>
  fetchWithAuth(`${BASE}?limit=${limit}`);

export const fetchFeedbackMetrics = () => fetchWithAuth(`${BASE}/metrics`);

export const fetchConversionInsights = (userId?: number) => {
  const url = userId
    ? `${BASE}/conversion-insights?userId=${userId}`
    : `${BASE}/conversion-insights`;
  return fetchWithAuth(url);
};

export const fetchTopPerformingFeatures = () =>
  fetchWithAuth(`${BASE}/conversion-insights/top-features`);
