import { fetchWithAuth } from '../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001/feedback';

// ارسال بازخورد
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

// دریافت همهٔ بازخوردها (برای ادمین)
export const fetchAllFeedback = (limit = 100) =>
  fetchWithAuth(`${BASE}?limit=${limit}`);

// دریافت متریک‌های کلی
export const fetchFeedbackMetrics = () =>
  fetchWithAuth(`${BASE}/metrics`);

// دریافت بینش تبدیل
export const fetchConversionInsights = (userId?: number) => {
  const url = userId
    ? `${BASE}/conversion-insights?userId=${userId}`
    : `${BASE}/conversion-insights`;
  return fetchWithAuth(url);
};

// دریافت ویژگی‌های با عملکرد برتر
export const fetchTopPerformingFeatures = () =>
  fetchWithAuth(`${BASE}/conversion-insights/top-features`);